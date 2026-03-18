package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.user.StaffCreateRequest;
import org.childinsurance.education.dto.user.UpdateUserRequest;
import org.childinsurance.education.dto.user.UserRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.repository.RoleRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.childinsurance.education.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * User Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with pagination");
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        log.info("Fetching user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });
        return mapToResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching current user profile for ID: {}", userId);
        return getUserById(userId);
    }

    @Override
    public UserResponse updateCurrentUserProfile(UpdateUserRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Updating current user profile for ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
                log.warn("Email already exists: {}", request.getEmail());
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        User updatedUser = userRepository.save(user);
        log.info("User profile updated successfully");
        return mapToResponse(updatedUser);
    }

    @Override
    public UserResponse updateUser(Long userId, UserRequest request) {
        log.info("Updating user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
                log.warn("Email already exists: {}", request.getEmail());
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully");
        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        log.info("Deleting user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User", "userId", userId);
                });

        userRepository.delete(user);
        log.info("User deleted successfully");
    }

    @Override
    public UserResponse createStaff(StaffCreateRequest request) {
        log.info("Creating staff account for email: {} with role: {}", request.getEmail(), request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        if (!request.getRole().equals("UNDERWRITER") && !request.getRole().equals("CLAIMS_OFFICER")) {
            log.error("Invalid role for staff creation: {}", request.getRole());
            throw new RuntimeException("Invalid role. Only UNDERWRITER or CLAIMS_OFFICER roles can be created.");
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .provider("LOCAL")
                .build();

        User savedUser = userRepository.save(user);
        log.info("Staff account created successfully for email: {}", savedUser.getEmail());

        Long currentAdminId = SecurityUtils.getCurrentUserId();
        String currentAdminEmail = SecurityUtils.getCurrentUserEmail();
        auditLogService.logAction(currentAdminId, currentAdminEmail, "ADMIN", 
                "STAFF_CREATION", "User", savedUser.getUserId(), 
                "Admin created new " + request.getRole() + " account: " + savedUser.getEmail());

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse updateUserStatus(Long userId, boolean active) {
        log.info("Updating status for user ID: {} to {}", userId, active);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        user.setActive(active);
        User updatedUser = userRepository.save(user);
        log.info("User status updated successfully");

        Long currentAdminId = SecurityUtils.getCurrentUserId();
        String currentAdminEmail = SecurityUtils.getCurrentUserEmail();
        auditLogService.logAction(currentAdminId, currentAdminEmail, "ADMIN", 
                "USER_STATUS_UPDATE", "User", userId, 
                "Admin updated status for " + updatedUser.getEmail() + " to " + (active ? "ACTIVE" : "INACTIVE"));

        return mapToResponse(updatedUser);
    }

    /**
     * Map User entity to UserResponse DTO
     */
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().getRoleName())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

