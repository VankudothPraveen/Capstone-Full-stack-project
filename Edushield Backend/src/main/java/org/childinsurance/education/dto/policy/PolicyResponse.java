package org.childinsurance.education.dto.policy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for policy response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyResponse {
    private Long policyId;
    private String policyName;
    private BigDecimal basePremium;
    private Integer durationYears;
    private BigDecimal bonusPercentage;
    private BigDecimal riskCoverageAmount;
    private Integer minChildAge;
    private Integer maxChildAge;
    private BigDecimal maturityBenefitAmount;
    private BigDecimal deathBenefitMultiplier;
    private Boolean waiverOfPremium;
    private Boolean isActive;
    private String description;
}
