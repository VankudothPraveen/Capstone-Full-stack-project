package org.childinsurance.education.service;

import org.childinsurance.education.dto.user.StaffCreateRequest;
import org.childinsurance.education.dto.user.UpdateUserRequest;
import org.childinsurance.education.dto.user.UserRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * User Service Interface
 */
public interface UserService {
    /**
     * Get all users with pagination
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Get user by ID
     */
    UserResponse getUserById(Long userId);

    /**
     * Get current logged-in user profile
     */
    UserResponse getCurrentUserProfile();

    /**
     * Update current user profile
     */
    UserResponse updateCurrentUserProfile(UpdateUserRequest request);

    /**
     * Update user details (Admin)
     */
    UserResponse updateUser(Long userId, UserRequest request);

    /**
     * Delete user by ID
     */
    void deleteUser(Long userId);

    /**
     * Create staff account (Admin only)
     */
    UserResponse createStaff(StaffCreateRequest request);

    /**
     * Update user status (Admin only)
     */
    UserResponse updateUserStatus(Long userId, boolean active);
}

