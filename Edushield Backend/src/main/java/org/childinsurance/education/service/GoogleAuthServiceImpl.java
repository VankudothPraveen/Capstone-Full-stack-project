package org.childinsurance.education.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.GoogleLoginRequest;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.RoleRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.CustomUserDetails;
import org.childinsurance.education.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GoogleAuthServiceImpl implements GoogleAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Override
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                log.error("Invalid Google Token");
                return AuthResponse.error("Invalid Google Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            log.info("Google login attempt for email: {}", email);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                log.info("Creating new user for Google login: {}", email);
                Role role = roleRepository.findByRoleName("USER")
                        .orElseThrow(() -> new RuntimeException("Default ROLE_USER not found"));

                user = User.builder()
                        .email(email)
                        .name(name)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password for OAuth users
                        .phone("")
                        .provider("GOOGLE")
                        .imageUrl(pictureUrl)
                        .role(role)
                        .isActive(true)
                        .createdAt(LocalDateTime.now())
                        .build();
                user = userRepository.save(user);
            } else {
                // Update provider if it was local before? Usually we keep it as it is or link them.
                if (!"GOOGLE".equals(user.getProvider())) {
                    user.setProvider("GOOGLE");
                    user.setImageUrl(pictureUrl);
                    user = userRepository.save(user);
                }
            }

            CustomUserDetails userDetails = CustomUserDetails.builder()
                    .userId(user.getUserId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().getRoleName())
                    .provider(user.getProvider())
                    .enabled(user.isActive())
                    .build();

            String jwtToken = jwtTokenProvider.generateTokenFromUser(userDetails);

            return AuthResponse.success(
                    "Google login successful",
                    jwtToken,
                    AuthResponse.UserInfo.builder()
                            .userId(user.getUserId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(user.getRole().getRoleName())
                            .provider(user.getProvider())
                            .build()
            );

        } catch (Exception e) {
            log.error("Error during Google OAuth verification: {}", e.getMessage(), e);
            return AuthResponse.error("Google authentication failed: " + e.getMessage());
        }
    }
}
