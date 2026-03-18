package org.childinsurance.education.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationAnalyticsResponse {
    private long totalApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long pendingApplications;
    private double approvalRate;
}
