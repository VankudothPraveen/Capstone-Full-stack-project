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

@Entity
@Table(name = "claim")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long claimId;

    @Column(name = "claim_type", nullable = false)
    private String claimType;

    @Column(name = "claim_date", nullable = false)
    private LocalDate claimDate;

    @Column(name = "claim_amount", nullable = false)
    private BigDecimal claimAmount;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "payout_date")
    private LocalDate payoutDate;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private PolicySubscription policySubscription;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
