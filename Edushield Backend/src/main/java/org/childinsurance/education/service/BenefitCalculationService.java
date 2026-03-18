package org.childinsurance.education.service;

import org.childinsurance.education.dto.benefit.BenefitCalculationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BenefitCalculationService {
    Page<BenefitCalculationResponse> getMyCalculations(Pageable pageable);
    BenefitCalculationResponse getCalculationById(Long calculationId);
    List<BenefitCalculationResponse> getCalculationsBySubscriptionId(Long subscriptionId);
    BenefitCalculationResponse calculate(Long subscriptionId, String benefitType);
}
