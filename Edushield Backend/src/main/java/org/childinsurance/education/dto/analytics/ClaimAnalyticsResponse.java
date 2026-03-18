package org.childinsurance.education.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClaimAnalyticsResponse {
    private long totalClaims;
    private long approvedClaims;
    private long rejectedClaims;
    private long pendingClaims;
    private double approvalRate;
}
