package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.dashboard.DashboardMetrics;
import org.childinsurance.education.dto.dashboard.MonthlyRevenueReport;
import org.childinsurance.education.entity.Claim;
import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.entity.PremiumPayment;
import org.childinsurance.education.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Dashboard Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PolicyApplicationRepository policyApplicationRepository;
    private final PolicySubscriptionRepository policySubscriptionRepository;
    private final PremiumPaymentRepository premiumPaymentRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final PolicyRepository policyRepository;

    @Override
    public DashboardMetrics getDashboardMetrics() {
        log.info("Fetching all dashboard metrics");

        // Active subscriptions = policies
        long activePolicies = policySubscriptionRepository.countActiveSubscriptions();

        // Total policies in catalog
        long totalPolicies = policyRepository.count();

        // Total premium paid across all payments
        BigDecimal totalPremiumPaid = premiumPaymentRepository.calculateTotalPremiumCollected();
        if (totalPremiumPaid == null)
            totalPremiumPaid = BigDecimal.ZERO;

        // Children
        long totalChildren = childRepository.count();

        // Applications
        long totalApplications = policyApplicationRepository.count();
        long pendingApplications = policyApplicationRepository.countByStatus("PENDING");
        long approvedApplications = policyApplicationRepository.countByStatus("APPROVED");
        long rejectedApplications = policyApplicationRepository.countByStatus("REJECTED");

        // Claims
        long pendingClaims = claimRepository.countByStatus("SUBMITTED") + claimRepository.countByStatus("PENDING");
        long approvedClaims = claimRepository.countByStatus("APPROVED");
        long totalClaimsCount = claimRepository.count();

        BigDecimal totalClaimAmount = claimRepository.calculateTotalApprovedClaimAmount();
        if (totalClaimAmount == null)
            totalClaimAmount = BigDecimal.ZERO;

        // Users
        long totalUsers = userRepository.count();

        return DashboardMetrics.builder()
                .activePolicies(activePolicies)
                .totalPolicies(totalPolicies)
                .totalPremiumPaid(totalPremiumPaid)
                .totalChildren(totalChildren)
                .upcomingPayments(pendingApplications) // pending apps needing action
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .totalClaimAmount(totalClaimAmount)
                .totalUsers(totalUsers)
                .totalApplications(totalApplications)
                .pendingApplications(pendingApplications)
                .approvedApplications(approvedApplications)
                .rejectedApplications(rejectedApplications)
                .totalClaimsCount(totalClaimsCount)
                .build();
    }

    @Override
    public long getActivePoliciesCount() {
        return policySubscriptionRepository.countActiveSubscriptions();
    }

    @Override
    public BigDecimal getTotalPremiumCollected() {
        BigDecimal total = premiumPaymentRepository.calculateTotalPremiumCollected();
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public long getTotalClaimsCount() {
        return claimRepository.count();
    }

    @Override
    public BigDecimal getTotalClaimsAmount() {
        BigDecimal total = claimRepository.calculateTotalApprovedClaimAmount();
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public List<MonthlyRevenueReport> getMonthlyRevenueReport() {
        log.info("Generating monthly revenue report");

        List<MonthlyRevenueReport> reports = new ArrayList<>();

        for (int i = 11; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();

            // Monthly payments
            List<PremiumPayment> monthlyPayments = premiumPaymentRepository
                    .findPaymentsBetweenDates(startDate, endDate);
            BigDecimal monthlyRevenue = monthlyPayments.stream()
                    .map(PremiumPayment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Monthly claims
            List<Claim> monthlyClaims = claimRepository.findClaimsBetweenDates(startDate, endDate);
            BigDecimal totalClaimsAmt = monthlyClaims.stream()
                    .map(Claim::getClaimAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Net = revenue - claims
            BigDecimal netRevenue = monthlyRevenue.subtract(totalClaimsAmt);

            // Month as abbreviated name: "Jan", "Feb", etc.
            String monthName = yearMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            MonthlyRevenueReport report = MonthlyRevenueReport.builder()
                    .month(monthName)
                    .year(yearMonth.getYear())
                    .totalRevenue(monthlyRevenue)
                    .totalPayments((long) monthlyPayments.size())
                    .totalClaims((long) monthlyClaims.size())
                    .netRevenue(netRevenue)
                    .build();

            reports.add(report);
        }

        return reports;
    }
}
