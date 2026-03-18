package org.childinsurance.education.dto.benefit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenefitCalculationResponse {
    private Long calculationId;
    private LocalDate calculationDate;
    private BigDecimal baseAmount;
    private BigDecimal loyaltyBonus;
    private BigDecimal guaranteedAddition;
    private BigDecimal annualIncrement;
    private BigDecimal totalBenefit;
    private String benefitType;
    private Long subscriptionId;
}
