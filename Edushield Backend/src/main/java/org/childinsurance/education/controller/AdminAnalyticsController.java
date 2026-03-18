package org.childinsurance.education.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.analytics.*;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@Tag(name = "Admin Analytics", description = "APIs for dashboard analytics and statistics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get system overview statistics")
    public ResponseEntity<ApiResponse<DashboardOverviewResponse>> getOverview() {
        return ResponseEntity.ok(ApiResponse.success("Overview stats fetched successfully", analyticsService.getOverview()));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get revenue analytics")
    public ResponseEntity<ApiResponse<RevenueAnalyticsResponse>> getRevenue() {
        return ResponseEntity.ok(ApiResponse.success("Revenue stats fetched successfully", analyticsService.getRevenueAnalytics()));
    }

    @GetMapping("/claims")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get claims stats")
    public ResponseEntity<ApiResponse<ClaimAnalyticsResponse>> getClaims() {
        return ResponseEntity.ok(ApiResponse.success("Claims stats fetched successfully", analyticsService.getClaimAnalytics()));
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get application stats")
    public ResponseEntity<ApiResponse<ApplicationAnalyticsResponse>> getApplications() {
        return ResponseEntity.ok(ApiResponse.success("Application stats fetched successfully", analyticsService.getApplicationAnalytics()));
    }

    @GetMapping("/policies")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get policy distribution")
    public ResponseEntity<ApiResponse<PolicyDistributionResponse>> getPolicies() {
        return ResponseEntity.ok(ApiResponse.success("Policy distribution fetched successfully", analyticsService.getPolicyDistribution()));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user growth stats")
    public ResponseEntity<ApiResponse<UserGrowthResponse>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success("User growth stats fetched successfully", analyticsService.getUserGrowth()));
    }
}
