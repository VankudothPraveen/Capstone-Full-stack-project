package org.childinsurance.education.dto.claim;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for claim response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimResponse {
    private Long claimId;
    private String claimType;
    private LocalDate claimDate;
    private BigDecimal claimAmount;
    private String status;
    private Long subscriptionId;
    private String subscriptionNumber;
    private String policyName;
    private Long applicationId;
    private Long userId;
    private String policyNumber;
    private LocalDate approvalDate;
    private LocalDate payoutDate;
    private String reason;
    private String rejectionReason;
}
