package org.childinsurance.education.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.subscription.PolicySubscriptionResponse;
import org.childinsurance.education.service.PolicySubscriptionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@AllArgsConstructor
@Tag(name = "Policy Subscriptions", description = "Manage active policy subscriptions")
@SecurityRequirement(name = "Bearer Authentication")
public class PolicySubscriptionController {

    private final PolicySubscriptionService policySubscriptionService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get my subscriptions")
    public ResponseEntity<ApiResponse<Page<PolicySubscriptionResponse>>> getMySubscriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("subscriptionId").descending());
        Page<PolicySubscriptionResponse> subscriptions = policySubscriptionService.getMySubscriptions(pageable);
        return ResponseEntity.ok(ApiResponse.success("Subscriptions retrieved successfully", subscriptions));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Get subscription by ID")
    public ResponseEntity<ApiResponse<PolicySubscriptionResponse>> getSubscriptionById(@PathVariable Long id) {
        PolicySubscriptionResponse subscription = policySubscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(ApiResponse.success("Subscription retrieved successfully", subscription));
    }

    /**
     * GET /api/subscriptions/application/{applicationId}
     * Get subscription by application ID
     */
    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Get subscription by application ID")
    public ResponseEntity<ApiResponse<PolicySubscriptionResponse>> getSubscriptionByApplicationId(
            @PathVariable Long applicationId) {
        PolicySubscriptionResponse subscription = policySubscriptionService.getSubscriptionByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Subscription retrieved successfully", subscription));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all subscriptions (Admin)")
    public ResponseEntity<ApiResponse<Page<PolicySubscriptionResponse>>> getAllSubscriptions(Pageable pageable) {
        Page<PolicySubscriptionResponse> subscriptions = policySubscriptionService.getAllSubscriptions(pageable);
        return ResponseEntity.ok(ApiResponse.success("All subscriptions retrieved successfully", subscriptions));
    }

    @PostMapping("/process-maturity")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process matured subscriptions (Admin)")
    public ResponseEntity<ApiResponse<String>> processMaturedSubscriptions() {
        policySubscriptionService.processMaturedSubscriptions();
        return ResponseEntity.ok(ApiResponse.success("Matured subscriptions processed successfully", null));
    }
}
