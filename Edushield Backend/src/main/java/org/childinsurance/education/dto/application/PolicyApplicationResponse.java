package org.childinsurance.education.dto.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for policy application response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyApplicationResponse {
    private Long applicationId;
    private String policyNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String paymentFrequency;
    private LocalDate applicationDate;
    private LocalDate approvalDate;
    private String rejectionReason;
    private BigDecimal totalPaidAmount;
    private Long userId;
    private Long policyId;
    private Long childId;
    private String policyName;
    private String childName;
    private Integer riskScore;
    private String riskCategory;
    private BigDecimal calculatedPremium;
    private String userName;
    private BigDecimal basePremium;
}

