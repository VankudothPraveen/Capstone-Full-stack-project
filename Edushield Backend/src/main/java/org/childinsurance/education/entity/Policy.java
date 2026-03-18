package org.childinsurance.education.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "policy")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id")
    private Long policyId;

    @Column(name = "policy_name", nullable = false)
    private String policyName;

    @Column(name = "base_premium", nullable = false)
    private BigDecimal basePremium;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears;

    @Column(name = "bonus_percentage", nullable = false)
    private BigDecimal bonusPercentage;

    @Column(name = "risk_coverage_amount", nullable = false)
    private BigDecimal riskCoverageAmount;

    @Column(name = "min_child_age", nullable = false)
    private Integer minChildAge;

    @Column(name = "max_child_age", nullable = false)
    private Integer maxChildAge;

    @Column(name = "maturity_benefit_amount", nullable = false)
    private BigDecimal maturityBenefitAmount;

    @Column(name = "death_benefit_multiplier", nullable = false)
    private BigDecimal deathBenefitMultiplier;

    @Column(name = "waiver_of_premium", nullable = false)
    private Boolean waiverOfPremium;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "description")
    private String description;

    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PolicyApplication> policyApplications = new HashSet<>();
}

