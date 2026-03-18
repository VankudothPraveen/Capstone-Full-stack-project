package org.childinsurance.education.dto.claim;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for claim request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequest {

    @NotNull(message = "Subscription ID is required")
    private Long subscriptionId;

    private Long applicationId; // Optional - for reference

    @NotNull(message = "Claim type is required")
    private String claimType;

    @NotNull(message = "Claim date is required")
    private LocalDate claimDate;

    @NotNull(message = "Claim amount is required")
    @Positive(message = "Claim amount must be positive")
    private BigDecimal claimAmount;
}

