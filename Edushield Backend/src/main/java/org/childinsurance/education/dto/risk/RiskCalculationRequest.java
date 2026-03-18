package org.childinsurance.education.dto.risk;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RiskCalculationRequest {
    private Integer parentAge;
    private String occupation;
    private BigDecimal annualIncome;
    private BigDecimal coverageAmount;
    private Long policyId;
}
