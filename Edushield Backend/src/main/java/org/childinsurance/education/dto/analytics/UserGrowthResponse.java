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
public class UserGrowthResponse {
    private List<MonthlyGrowth> growth;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyGrowth {
        private String month;
        private long count;
    }
}
