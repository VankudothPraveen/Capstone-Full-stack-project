package org.childinsurance.education.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for monthly revenue report - field names match the Angular frontend
 * interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyRevenueReport {
    // Matches frontend: month (string like "Jan", "Feb")
    private String month;
    // Matches frontend: year
    private int year;
    // Matches frontend: totalRevenue
    private BigDecimal totalRevenue;
    // Matches frontend: totalPayments
    private long totalPayments;
    // Matches frontend: totalClaims
    private long totalClaims;
    // Matches frontend: netRevenue
    private BigDecimal netRevenue;
}
