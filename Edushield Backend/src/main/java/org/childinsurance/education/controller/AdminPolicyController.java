package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.dto.policy.PolicyRequest;
import org.childinsurance.education.dto.policy.PolicyResponse;
import org.childinsurance.education.service.PolicyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin Policy Controller for policy management (Admin APIs)
 * Base URL: /api/admin/policies
 */
@RestController
@RequestMapping("/api/admin/policies")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class AdminPolicyController {

    private final PolicyService policyService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PolicyResponse> policies = policyService.getAllPolicies(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Policies retrieved successfully",
                policies.getContent(),
                policies.getNumber(),
                policies.getSize(),
                policies.getTotalElements(),
                policies.getTotalPages()
        ));
    }

    @GetMapping("/{policyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getPolicyById(@PathVariable Long policyId) {
        PolicyResponse policy = policyService.getPolicyById(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved successfully", policy));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> createPolicy(@Valid @RequestBody PolicyRequest request) {
        PolicyResponse response = policyService.createPolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy created successfully", response));
    }

    @PutMapping("/{policyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> updatePolicy(
            @PathVariable Long policyId,
            @Valid @RequestBody PolicyRequest request) {
        PolicyResponse response = policyService.updatePolicy(policyId, request);
        return ResponseEntity.ok(ApiResponse.success("Policy updated successfully", response));
    }

    @DeleteMapping("/{policyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deletePolicy(@PathVariable Long policyId) {
        policyService.deletePolicy(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy deleted successfully", null));
    }

    /**
     * PUT /api/admin/policies/{policyId}/activate
     * Activate a policy
     */
    @PutMapping("/{policyId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> activatePolicy(@PathVariable Long policyId) {
        PolicyResponse response = policyService.activatePolicy(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy activated successfully", response));
    }

    /**
     * PUT /api/admin/policies/{policyId}/deactivate
     * Deactivate a policy
     */
    @PutMapping("/{policyId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deactivatePolicy(@PathVariable Long policyId) {
        PolicyResponse response = policyService.deactivatePolicy(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy deactivated successfully", response));
    }
}
