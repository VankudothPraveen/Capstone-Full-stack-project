package org.childinsurance.education.service;

import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.risk.RiskCalculationRequest;
import org.childinsurance.education.dto.risk.RiskCalculationResponse;
import org.childinsurance.education.entity.Policy;
import org.childinsurance.education.repository.PolicyRepository;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RiskAssessmentServiceImpl implements RiskAssessmentService {

    private final PolicyRepository policyRepository;

    @Override
    public RiskCalculationResponse calculateRisk(RiskCalculationRequest request) {
        validateRequest(request);

        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + request.getPolicyId()));

        BigDecimal annualPremium = policy.getBasePremium().multiply(new BigDecimal("12"));

        int ageRisk = calculateAgeRisk(request.getParentAge());
        int occupationRisk = calculateOccupationRisk(request.getOccupation());
        int incomeRisk = calculateIncomeRisk(annualPremium, request.getAnnualIncome());
        int coverageRisk = calculateCoverageRisk(request.getCoverageAmount(), request.getAnnualIncome());

        int riskScore = ageRisk + occupationRisk + incomeRisk + coverageRisk;
        // Cap risk score between 0 and 100
        riskScore = Math.max(0, Math.min(100, riskScore));

        String riskCategory = determineRiskCategory(riskScore);
        BigDecimal finalPremium = calculatePremium(policy.getBasePremium(), riskCategory);

        return RiskCalculationResponse.builder()
                .riskScore(riskScore)
                .riskCategory(riskCategory)
                .calculatedPremium(finalPremium)
                .build();
    }

    private void validateRequest(RiskCalculationRequest request) {
        if (request.getAnnualIncome() == null || request.getCoverageAmount() == null) {
            throw new IllegalArgumentException("Income and Coverage Amount must be provided.");
        }
    }

    private int calculateAgeRisk(Integer age) {
        if (age == null) return 10; 
        if (age >= 21 && age <= 30) return 5;
        if (age >= 31 && age <= 40) return 10;
        if (age >= 41 && age <= 50) return 18;
        if (age >= 51) return 25; 
        return 5; 
    }

    private int calculateOccupationRisk(String occupation) {
        if (occupation == null) return 6; // default
        String occ = occupation.trim().toLowerCase();
        
        if (occ.contains("teacher") || occ.contains("engineer") || occ.contains("doctor")) return 5;
        if (occ.contains("office") || occ.contains("clerk") || occ.contains("bank")) return 6;
        if (occ.contains("business") || occ.contains("owner") || occ.contains("trader")) return 8;
        if (occ.contains("driver")) return 12;
        if (occ.contains("construction") || occ.contains("builder") || occ.contains("mason")) return 18;
        if (occ.contains("army") || occ.contains("police") || occ.contains("soldier")) return 20;
        if (occ.contains("mining") || occ.contains("hazardous")) return 25;
        
        return 6; // Default generic risk (Office Worker equiv)
    }

    private int calculateIncomeRisk(BigDecimal annualPremium, BigDecimal annualIncome) {
        if (annualIncome == null || annualIncome.compareTo(BigDecimal.ZERO) == 0) return 20;
        
        BigDecimal ratio = annualPremium.divide(annualIncome, 4, java.math.RoundingMode.HALF_UP);
        double percentage = ratio.doubleValue() * 100;
        
        if (percentage < 5.0) return 2;
        if (percentage >= 5.0 && percentage < 10.0) return 5;
        if (percentage >= 10.0 && percentage < 20.0) return 10;
        if (percentage >= 20.0 && percentage <= 30.0) return 15;
        return 20; // > 30%
    }

    private int calculateCoverageRisk(BigDecimal coverage, BigDecimal annualIncome) {
        if (annualIncome == null || annualIncome.compareTo(BigDecimal.ZERO) == 0) return 30;
        
        BigDecimal ratio = coverage.divide(annualIncome, 4, java.math.RoundingMode.HALF_UP);
        double ratioDouble = ratio.doubleValue();
        
        if (ratioDouble <= 5.0) return 5;
        if (ratioDouble > 5.0 && ratioDouble <= 10.0) return 10;
        if (ratioDouble > 10.0 && ratioDouble <= 15.0) return 18;
        if (ratioDouble > 15.0 && ratioDouble <= 20.0) return 24;
        return 30; // > 20x
    }

    private String determineRiskCategory(int riskScore) {
        if (riskScore <= 25) return "LOW";
        if (riskScore <= 50) return "MEDIUM";
        if (riskScore <= 75) return "HIGH";
        return "VERY_HIGH";
    }

    private BigDecimal calculatePremium(BigDecimal basePremium, String riskCategory) {
        BigDecimal multiplier = switch (riskCategory) {
            case "LOW" -> new BigDecimal("1.0");
            case "MEDIUM" -> new BigDecimal("1.2");
            case "HIGH" -> new BigDecimal("1.5");
            case "VERY_HIGH" -> new BigDecimal("2.0");
            default -> new BigDecimal("1.0");
        };
        
        return basePremium.multiply(multiplier);
    }
}
