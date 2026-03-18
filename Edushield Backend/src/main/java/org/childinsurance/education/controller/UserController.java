package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.dto.user.UpdateUserRequest;
import org.childinsurance.education.dto.user.UserRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.childinsurance.education.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * User Controller for user management
 * Base URL: /api/users
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users/me
     * Get logged-in user profile
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getLoggedInUserProfile() {
        UserResponse response = userService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", response));
    }

    /**
     * PUT /api/users/me
     * Update logged-in user profile
     */
    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateLoggedInUserProfile(@Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateCurrentUserProfile(request);
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", response));
    }

    /**
     * GET /api/users
     * Get all users (Admin API)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Users retrieved successfully",
                users.getContent(),
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages()
        ));
    }

    /**
     * GET /api/users/{userId}
     * Get user by ID (Admin API)
     */
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long userId) {
        UserResponse response = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response));
    }

    /**
     * DELETE /api/users/{userId}
     * Delete user (Admin API)
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}

