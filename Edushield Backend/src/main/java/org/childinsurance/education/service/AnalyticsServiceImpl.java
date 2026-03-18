package org.childinsurance.education.service;

import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.analytics.*;
import org.childinsurance.education.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final PolicyApplicationRepository applicationRepository;
    private final ClaimRepository claimRepository;
    private final PremiumPaymentRepository paymentRepository;

    @Override
    public DashboardOverviewResponse getOverview() {
        return DashboardOverviewResponse.builder()
                .totalUsers(userRepository.countUsers())
                .totalPolicies(policyRepository.count())
                .totalApplications(applicationRepository.count())
                .activePolicies(applicationRepository.countByStatus("ACTIVE") + applicationRepository.countByStatus("APPROVED"))
                .pendingClaims(claimRepository.countByStatus("PENDING"))
                .build();
    }

    @Override
    public RevenueAnalyticsResponse getRevenueAnalytics() {
        List<Object[]> monthlyData = paymentRepository.findMonthlyRevenue();
        List<RevenueAnalyticsResponse.MonthlyRevenue> monthlyRevenue = monthlyData.stream()
                .map(obj -> new RevenueAnalyticsResponse.MonthlyRevenue((String) obj[0], (BigDecimal) obj[1]))
                .collect(Collectors.toList());

        return RevenueAnalyticsResponse.builder()
                .totalRevenue(paymentRepository.calculateTotalPremiumCollected())
                .averagePremium(paymentRepository.calculateAveragePremium())
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    @Override
    public ClaimAnalyticsResponse getClaimAnalytics() {
        long total = claimRepository.count();
        long approved = claimRepository.countByStatus("APPROVED") + claimRepository.countByStatus("PAID");
        long rejected = claimRepository.countByStatus("REJECTED");
        long pending = claimRepository.countByStatus("PENDING") + claimRepository.countByStatus("SUBMITTED");

        double rate = total == 0 ? 0 : (double) approved / total * 100;

        return ClaimAnalyticsResponse.builder()
                .totalClaims(total)
                .approvedClaims(approved)
                .rejectedClaims(rejected)
                .pendingClaims(pending)
                .approvalRate(rate)
                .build();
    }

    @Override
    public ApplicationAnalyticsResponse getApplicationAnalytics() {
        long total = applicationRepository.count();
        long approved = applicationRepository.countByStatus("APPROVED") + applicationRepository.countByStatus("ACTIVE");
        long rejected = applicationRepository.countByStatus("REJECTED") + applicationRepository.countByStatus("CANCELLED");
        long pending = applicationRepository.countByStatus("PENDING") + applicationRepository.countByStatus("SUBMITTED");

        double rate = total == 0 ? 0 : (double) approved / total * 100;

        return ApplicationAnalyticsResponse.builder()
                .totalApplications(total)
                .approvedApplications(approved)
                .rejectedApplications(rejected)
                .pendingApplications(pending)
                .approvalRate(rate)
                .build();
    }

    @Override
    public PolicyDistributionResponse getPolicyDistribution() {
        List<Object[]> dist = applicationRepository.findPolicyDistribution();
        List<PolicyDistributionResponse.PolicyStat> stats = dist.stream()
                .map(obj -> new PolicyDistributionResponse.PolicyStat((String) obj[0], (long) obj[1]))
                .collect(Collectors.toList());

        return PolicyDistributionResponse.builder()
                .distribution(stats)
                .build();
    }

    @Override
    public UserGrowthResponse getUserGrowth() {
        List<Object[]> growth = userRepository.findUserGrowth();
        List<UserGrowthResponse.MonthlyGrowth> monthlyGrowth = growth.stream()
                .map(obj -> new UserGrowthResponse.MonthlyGrowth((String) obj[0], (long) obj[1]))
                .collect(Collectors.toList());

        return UserGrowthResponse.builder()
                .growth(monthlyGrowth)
                .build();
    }
}
