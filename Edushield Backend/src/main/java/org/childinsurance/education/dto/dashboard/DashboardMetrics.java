package org.childinsurance.education.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for dashboard metrics - field names match the Angular frontend interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMetrics {
    // Matches frontend: activePolicies
    private long activePolicies;
    // Matches frontend: totalPolicies
    private long totalPolicies;
    // Matches frontend: totalPremiumPaid
    private BigDecimal totalPremiumPaid;
    // Matches frontend: totalChildren
    private long totalChildren;
    // Matches frontend: upcomingPayments
    private long upcomingPayments;
    // Matches frontend: pendingClaims
    private long pendingClaims;
    // Matches frontend: approvedClaims
    private long approvedClaims;
    // Matches frontend: totalClaimAmount
    private BigDecimal totalClaimAmount;
    // Extra admin fields
    private long totalUsers;
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalClaimsCount;
}
