package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.user.StaffCreateRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.childinsurance.education.dto.user.UserStatusRequest;
import org.childinsurance.education.service.UserService;
import org.childinsurance.education.dto.common.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserService userService;

    @PostMapping("/create-staff")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(@Valid @RequestBody StaffCreateRequest request) {
        log.info("Admin creating staff account: {}", request.getEmail());
        UserResponse response = userService.createStaff(request);
        return ResponseEntity.ok(ApiResponse.success("Staff account created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        log.info("Admin fetching all users");
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UserStatusRequest request) {
        log.info("Admin updating status for user ID: {} to {}", userId, request.isActive());
        UserResponse response = userService.updateUserStatus(userId, request.isActive());
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", response));
    }
}
