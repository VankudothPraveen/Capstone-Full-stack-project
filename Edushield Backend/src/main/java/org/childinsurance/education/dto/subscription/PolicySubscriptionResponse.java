package org.childinsurance.education.dto.subscription;

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
public class PolicySubscriptionResponse {
    private Long subscriptionId;
    private String subscriptionNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate maturityDate;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private String status;
    private BigDecimal totalPaidAmount;
    private Long applicationId;
    private String policyName;
    private String childName;
}
