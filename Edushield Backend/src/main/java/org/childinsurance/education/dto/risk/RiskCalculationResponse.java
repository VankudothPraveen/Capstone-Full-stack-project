package org.childinsurance.education.dto.risk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskCalculationResponse {
    private Integer riskScore;
    private String riskCategory;
    private BigDecimal calculatedPremium;
}
