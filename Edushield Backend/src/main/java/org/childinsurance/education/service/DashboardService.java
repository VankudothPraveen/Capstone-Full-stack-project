package org.childinsurance.education.service;

import org.childinsurance.education.dto.dashboard.DashboardMetrics;
import org.childinsurance.education.dto.dashboard.MonthlyRevenueReport;

import java.util.List;

/**
 * Dashboard Service Interface
 */
public interface DashboardService {
    /**
     * Get all dashboard metrics
     */
    DashboardMetrics getDashboardMetrics();

    /**
     * Get total active policies count
     */
    long getActivePoliciesCount();

    /**
     * Get total premium collected
     */
    java.math.BigDecimal getTotalPremiumCollected();

    /**
     * Get total claims count
     */
    long getTotalClaimsCount();

    /**
     * Get total claims amount
     */
    java.math.BigDecimal getTotalClaimsAmount();

    /**
     * Get monthly revenue report
     */
    List<MonthlyRevenueReport> getMonthlyRevenueReport();
}

