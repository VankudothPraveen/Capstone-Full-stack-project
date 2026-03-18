package org.childinsurance.education.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOverviewResponse {
    private long totalUsers;
    private long totalPolicies;
    private long totalApplications;
    private long activePolicies;
    private long pendingClaims;
}
