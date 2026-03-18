package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.dashboard.DashboardMetrics;
import org.childinsurance.education.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard Controller (Admin)
 * Base URL: /api/admin/dashboard
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/admin/dashboard
     * Get all dashboard metrics
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardMetrics>> getDashboardMetrics() {
        DashboardMetrics metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved successfully", metrics));
    }

    /**
     * GET /api/admin/dashboard/revenue?year=2026
     * Get monthly revenue report
     */
    @GetMapping("/dashboard/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> getMonthlyRevenue(@RequestParam int year) {
        return ResponseEntity.ok(ApiResponse.success("Monthly revenue report retrieved successfully", 
                dashboardService.getMonthlyRevenueReport()));
    }
}