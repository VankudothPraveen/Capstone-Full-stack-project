package org.childinsurance.education.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for premium payment response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumPaymentResponse {
    private Long paymentId;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private LocalDate dueDate;
    private BigDecimal lateFee;
    private String status;
    private Long subscriptionId;
    private String subscriptionNumber;
    private String policyName;
    private Long applicationId;
}
