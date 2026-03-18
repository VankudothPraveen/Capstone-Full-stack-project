package org.childinsurance.education.dto.payment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for premium payment request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiumPaymentRequest {

    @NotNull(message = "Subscription ID is required")
    private Long subscriptionId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;
}

