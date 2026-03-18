package org.childinsurance.education.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PolicyDistributionResponse {
    private List<PolicyStat> distribution;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PolicyStat {
        private String policyName;
        private long count;
    }
}
