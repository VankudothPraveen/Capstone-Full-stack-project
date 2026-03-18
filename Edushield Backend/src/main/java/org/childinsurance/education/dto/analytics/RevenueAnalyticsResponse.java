package org.childinsurance.education.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevenueAnalyticsResponse {
    private BigDecimal totalRevenue;
    private BigDecimal averagePremium;
    private List<MonthlyRevenue> monthlyRevenue;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private BigDecimal amount;
    }
}
