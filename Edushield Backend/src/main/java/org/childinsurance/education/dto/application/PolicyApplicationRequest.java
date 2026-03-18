package org.childinsurance.education.dto.application;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for policy application request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyApplicationRequest {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotNull(message = "Child ID is required")
    private Long childId;

    @NotNull(message = "Payment frequency is required")
    private String paymentFrequency;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Integer parentAge;
    private String occupation;
    private BigDecimal annualIncome;
    private BigDecimal coverageAmount;
}

