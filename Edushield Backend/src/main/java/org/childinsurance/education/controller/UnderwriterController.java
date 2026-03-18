package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.application.PolicyApplicationResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.PolicyApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Underwriter Controller for reviewing policy applications
 */
@RestController
@RequestMapping("/api/underwriter/applications")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class UnderwriterController {

    private final PolicyApplicationService applicationService;

    @GetMapping
    @PreAuthorize("hasRole('UNDERWRITER')")
    public ResponseEntity<?> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PolicyApplicationResponse> applications = applicationService.getAllApplications(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "All applications retrieved successfully",
                applications.getContent(),
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages()
        ));
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasRole('UNDERWRITER')")
    public ResponseEntity<ApiResponse<?>> getApplicationById(@PathVariable Long applicationId) {
        PolicyApplicationResponse response = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Application retrieved successfully", response));
    }

    @PutMapping("/{applicationId}/approve")
    @PreAuthorize("hasRole('UNDERWRITER')")
    public ResponseEntity<ApiResponse<?>> approveApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) java.math.BigDecimal revisedPremium) {
        PolicyApplicationResponse response = applicationService.approveApplication(applicationId, revisedPremium);
        return ResponseEntity.ok(ApiResponse.success("Application approved successfully", response));
    }

    @PutMapping("/{applicationId}/reject")
    @PreAuthorize("hasRole('UNDERWRITER')")
    public ResponseEntity<ApiResponse<?>> rejectApplication(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String rejectionReason) {
        PolicyApplicationResponse response = applicationService.rejectApplication(applicationId, rejectionReason);
        return ResponseEntity.ok(ApiResponse.success("Application rejected successfully", response));
    }
}
