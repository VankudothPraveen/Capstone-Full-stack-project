package org.childinsurance.education.dto.policy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for policy request (create/update)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyRequest {

    @NotBlank(message = "Policy name is required")
    @Size(min = 3, max = 100, message = "Policy name must be between 3 and 100 characters")
    private String policyName;

    @NotNull(message = "Base premium is required")
    @Positive(message = "Base premium must be positive")
    private BigDecimal basePremium;

    @NotNull(message = "Duration in years is required")
    @Positive(message = "Duration must be positive")
    private Integer durationYears;

    @NotNull(message = "Bonus percentage is required")
    private BigDecimal bonusPercentage;

    @NotNull(message = "Risk coverage amount is required")
    @Positive(message = "Risk coverage amount must be positive")
    private BigDecimal riskCoverageAmount;

    @NotNull(message = "Minimum child age is required")
    private Integer minChildAge;

    @NotNull(message = "Maximum child age is required")
    private Integer maxChildAge;

    @NotNull(message = "Maturity benefit amount is required")
    @Positive(message = "Maturity benefit amount must be positive")
    private BigDecimal maturityBenefitAmount;

    @NotNull(message = "Death benefit multiplier is required")
    @Positive(message = "Death benefit multiplier must be positive")
    private BigDecimal deathBenefitMultiplier;

    @NotNull(message = "Waiver of premium is required")
    private Boolean waiverOfPremium;

    private Boolean isActive;

    private String description;
}
