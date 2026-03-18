package org.childinsurance.education.service;

import org.childinsurance.education.dto.analytics.*;

public interface AnalyticsService {
    DashboardOverviewResponse getOverview();
    RevenueAnalyticsResponse getRevenueAnalytics();
    ClaimAnalyticsResponse getClaimAnalytics();
    ApplicationAnalyticsResponse getApplicationAnalytics();
    PolicyDistributionResponse getPolicyDistribution();
    UserGrowthResponse getUserGrowth();
}
