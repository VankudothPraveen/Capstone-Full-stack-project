package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.application.PolicyApplicationRequest;
import org.childinsurance.education.dto.application.PolicyApplicationResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.PolicyApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Policy Application Controller
 * Base URL: /api/policy-applications
 */
@RestController
@RequestMapping("/api/policy-applications")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class PolicyApplicationController {

    private final PolicyApplicationService applicationService;

    /**
     * POST /api/policy-applications
     * Apply for policy
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> applyForPolicy(@Valid @RequestBody PolicyApplicationRequest request) {
        PolicyApplicationResponse response = applicationService.applyForPolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy application submitted successfully", response));
    }

    /**
     * GET /api/policy-applications/my
     * Get logged-in user applications
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PolicyApplicationResponse> applications = applicationService.getMyApplications(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Applications retrieved successfully",
                applications.getContent(),
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages()
        ));
    }

    /**
     * GET /api/policy-applications/{applicationId}
     * Get application details
     */
    @GetMapping("/{applicationId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getApplicationDetails(@PathVariable Long applicationId) {
        PolicyApplicationResponse response = applicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Application details retrieved successfully", response));
    }

    /**
     * PUT /api/policy-applications/{applicationId}/cancel
     * Cancel application
     */
    @PutMapping("/{applicationId}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> cancelApplication(@PathVariable Long applicationId) {
        PolicyApplicationResponse response = applicationService.cancelApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Application cancelled successfully", response));
    }

    /**
     * GET /api/policy-applications/{applicationId}/certificate
     * Download application certificate
     */
    @GetMapping("/{applicationId}/certificate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'UNDERWRITER')")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long applicationId) {
        byte[] pdfBytes = applicationService.downloadCertificate(applicationId);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "Policy_Certificate_APP-" + applicationId + ".pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}

