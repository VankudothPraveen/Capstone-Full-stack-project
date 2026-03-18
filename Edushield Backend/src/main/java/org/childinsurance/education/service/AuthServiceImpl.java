package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.ForgotPasswordRequest;
import org.childinsurance.education.dto.auth.LoginRequest;
import org.childinsurance.education.dto.auth.RegisterRequest;
import org.childinsurance.education.dto.auth.ResetPasswordRequest;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.RoleRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.CustomUserDetails;
import org.childinsurance.education.security.JwtTokenProvider;
import org.childinsurance.education.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Authentication Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuditLogService auditLogService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("User already exists with email: {}", request.getEmail());
            return AuthResponse.error("User already exists with this email");
        }

        // Get role
        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> {
                    log.error("Role not found: {}", request.getRole());
                    return new RuntimeException("Role not found: " + request.getRole());
                });

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getUserId());

        // Audit: User Registration
        auditLogService.logAction(savedUser.getUserId(), savedUser.getEmail(),
                role.getRoleName(), "USER_REGISTRATION", "User", savedUser.getUserId(),
                "New user registered: " + savedUser.getName());

        // Send welcome email (non-blocking – failures are logged, not thrown)
        emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getName());

        // Generate token for newly registered user
        CustomUserDetails userDetails = CustomUserDetails.builder()
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().getRoleName())
                .provider(savedUser.getProvider())
                .enabled(savedUser.isActive())
                .build();

        String token = jwtTokenProvider.generateTokenFromUser(userDetails);

        return AuthResponse.success(
                "User registered successfully",
                token,
                AuthResponse.UserInfo.builder()
                        .userId(savedUser.getUserId())
                        .name(savedUser.getName())
                        .email(savedUser.getEmail())
                        .role(savedUser.getRole().getRoleName())
                        .provider(savedUser.getProvider())
                        .build()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String token = jwtTokenProvider.generateToken(authentication);
            CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

            log.info("User logged in successfully: {}", request.getEmail());

            // Audit: User Login
            auditLogService.logAction(userPrincipal.getUserId(), userPrincipal.getEmail(),
                    userPrincipal.getRole(), "USER_LOGIN", "User", userPrincipal.getUserId(),
                    "User logged in: " + userPrincipal.getEmail());

            return AuthResponse.success(
                    "Login successful",
                    token,
                    AuthResponse.UserInfo.builder()
                            .userId(userPrincipal.getUserId())
                            .name(userPrincipal.getName())
                            .email(userPrincipal.getEmail())
                            .role(userPrincipal.getRole())
                            .provider(userPrincipal.getProvider())
                            .build()
            );
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getEmail(), e);
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
                
        // Return without error even if user not found, prevents email enumeration attacks
        if (user == null) {
            log.info("Forgot password requested for non-existent email: {}", request.getEmail());
            return;
        }

        // Generate 6-digit OTP
        String resetToken = String.format("%06d", new Random().nextInt(999999));
        
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Valid for 15 minutes
        userRepository.save(user);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid request"));

        // Validate token
        if (user.getResetToken() == null || !user.getResetToken().equals(request.getToken())) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        
        log.info("Password successfully reset for email: {}", request.getEmail());
    }
}

