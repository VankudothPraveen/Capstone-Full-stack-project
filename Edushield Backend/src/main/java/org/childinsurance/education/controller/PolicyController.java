package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.dto.policy.PolicyResponse;
import org.childinsurance.education.service.PolicyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Policy Controller for policy management (Customer APIs)
 * Base URL: /api/policies
 */
@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    /**
     * GET /api/policies
     * Get all policies
     */
    @GetMapping
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
                policies.getTotalPages()));
    }

    /**
     * GET /api/policies/{policyId}
     * Get policy details
     */
    @GetMapping("/{policyId}")
    public ResponseEntity<ApiResponse<?>> getPolicyDetails(@PathVariable Long policyId) {
        PolicyResponse response = policyService.getPolicyById(policyId);
        return ResponseEntity.ok(ApiResponse.success("Policy details retrieved successfully", response));
    }
}
