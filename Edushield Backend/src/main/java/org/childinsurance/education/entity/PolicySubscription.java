package org.childinsurance.education.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "policy_subscription")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicySubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long subscriptionId;

    @Column(name = "subscription_number", nullable = false, unique = true)
    private String subscriptionNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "maturity_date", nullable = false)
    private LocalDate maturityDate;

    @Column(name = "coverage_amount", nullable = false)
    private BigDecimal coverageAmount;

    @Column(name = "premium_amount", nullable = false)
    private BigDecimal premiumAmount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "total_paid_amount", nullable = false)
    @Builder.Default
    private BigDecimal totalPaidAmount = BigDecimal.ZERO;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private PolicyApplication policyApplication;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "policySubscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PremiumPayment> premiumPayments = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "policySubscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Claim> claims = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "policySubscription", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BenefitCalculation> benefitCalculations = new HashSet<>();
}
