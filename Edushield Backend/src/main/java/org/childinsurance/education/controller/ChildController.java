package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.child.ChildRequest;
import org.childinsurance.education.dto.child.ChildResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.ChildService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Child Controller for child management
 * Base URL: /api/children
 */
@RestController
@RequestMapping("/api/children")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class ChildController {

    private final ChildService childService;

    /**
     * POST /api/children
     * Add child
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> addChild(@Valid @RequestBody ChildRequest request) {
        ChildResponse response = childService.addChild(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Child added successfully", response));
    }

    /**
     * GET /api/children
     * Get all children of logged-in user
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getAllChildren(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChildResponse> children = childService.getAllChildren(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Children retrieved successfully",
                children.getContent(),
                children.getNumber(),
                children.getSize(),
                children.getTotalElements(),
                children.getTotalPages()
        ));
    }

    /**
     * GET /api/children/my
     * Get all children of logged-in user (alias for /api/children)
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyChildren(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChildResponse> children = childService.getAllChildren(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Children retrieved successfully",
                children.getContent(),
                children.getNumber(),
                children.getSize(),
                children.getTotalElements(),
                children.getTotalPages()
        ));
    }

    /**
     * GET /api/children/{childId}
     * Get child by ID
     */
    @GetMapping("/{childId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getChildById(@PathVariable Long childId) {
        ChildResponse response = childService.getChildById(childId);
        return ResponseEntity.ok(ApiResponse.success("Child retrieved successfully", response));
    }

    /**
     * PUT /api/children/{childId}
     * Update child
     */
    @PutMapping("/{childId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateChild(
            @PathVariable Long childId,
            @Valid @RequestBody ChildRequest request) {
        ChildResponse response = childService.updateChild(childId, request);
        return ResponseEntity.ok(ApiResponse.success("Child updated successfully", response));
    }

    /**
     * DELETE /api/children/{childId}
     * Delete child
     */
    @DeleteMapping("/{childId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteChild(@PathVariable Long childId) {
        childService.deleteChild(childId);
        return ResponseEntity.ok(ApiResponse.success("Child deleted successfully", null));
    }
}

