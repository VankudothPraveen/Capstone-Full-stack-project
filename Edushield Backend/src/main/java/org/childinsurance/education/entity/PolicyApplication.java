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
@Table(name = "policy_application")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "payment_frequency", nullable = false)
    private String paymentFrequency;

    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "total_paid_amount", nullable = false)
    private BigDecimal totalPaidAmount;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_category")
    private String riskCategory;

    @Column(name = "calculated_premium")
    private BigDecimal calculatedPremium;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private Child child;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "policyApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PremiumPayment> premiumPayments = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "policyApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Document> documents = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "policyApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private Nominee nominee;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "policyApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private PolicySubscription policySubscription;
}
