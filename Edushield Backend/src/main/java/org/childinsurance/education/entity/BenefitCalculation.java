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
@Table(name = "benefit_calculation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenefitCalculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calculation_id")
    private Long calculationId;

    @Column(name = "calculation_date", nullable = false)
    private LocalDate calculationDate;

    @Column(name = "base_amount", nullable = false)
    private BigDecimal baseAmount;

    @Column(name = "loyalty_bonus", nullable = false)
    @Builder.Default
    private BigDecimal loyaltyBonus = BigDecimal.ZERO;

    @Column(name = "guaranteed_addition", nullable = false)
    @Builder.Default
    private BigDecimal guaranteedAddition = BigDecimal.ZERO;

    @Column(name = "annual_increment", nullable = false)
    @Builder.Default
    private BigDecimal annualIncrement = BigDecimal.ZERO;

    @Column(name = "total_benefit", nullable = false)
    private BigDecimal totalBenefit;

    @Column(name = "benefit_type", nullable = false)
    private String benefitType;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private PolicySubscription policySubscription;
}
