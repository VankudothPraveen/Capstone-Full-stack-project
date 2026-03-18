package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.benefit.BenefitCalculationResponse;
import org.childinsurance.education.entity.BenefitCalculation;
import org.childinsurance.education.entity.PolicySubscription;
import org.childinsurance.education.repository.BenefitCalculationRepository;
import org.childinsurance.education.repository.PolicySubscriptionRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class BenefitCalculationServiceImpl implements BenefitCalculationService {

    private final BenefitCalculationRepository benefitCalculationRepository;
    private final PolicySubscriptionRepository policySubscriptionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<BenefitCalculationResponse> getMyCalculations(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching benefit calculations for user: {}", userId);
        return benefitCalculationRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public BenefitCalculationResponse getCalculationById(Long calculationId) {
        log.info("Fetching benefit calculation with ID: {}", calculationId);
        BenefitCalculation calc = benefitCalculationRepository.findById(calculationId)
                .orElseThrow(() -> new RuntimeException("Benefit calculation not found"));
        return mapToResponse(calc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BenefitCalculationResponse> getCalculationsBySubscriptionId(Long subscriptionId) {
        log.info("Fetching benefit calculations for subscription: {}", subscriptionId);
        return benefitCalculationRepository.findBySubscriptionId(subscriptionId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public BenefitCalculationResponse calculate(Long subscriptionId, String benefitType) {
        log.info("Calculating benefit for subscription: {}, type: {}", subscriptionId, benefitType);

        PolicySubscription subscription = policySubscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        BigDecimal baseAmount = subscription.getCoverageAmount();
        long yearsActive = ChronoUnit.YEARS.between(subscription.getStartDate(), LocalDate.now());
        if (yearsActive < 1) yearsActive = 1;

        BigDecimal loyaltyBonus = baseAmount.multiply(BigDecimal.valueOf(0.02))
                .multiply(BigDecimal.valueOf(yearsActive)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal guaranteedAddition = baseAmount.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal annualIncrement = baseAmount.multiply(BigDecimal.valueOf(0.03))
                .multiply(BigDecimal.valueOf(yearsActive)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalBenefit = baseAmount.add(loyaltyBonus).add(guaranteedAddition).add(annualIncrement);

        BenefitCalculation calc = BenefitCalculation.builder()
                .calculationDate(LocalDate.now())
                .baseAmount(baseAmount)
                .loyaltyBonus(loyaltyBonus)
                .guaranteedAddition(guaranteedAddition)
                .annualIncrement(annualIncrement)
                .totalBenefit(totalBenefit)
                .benefitType(benefitType)
                .policySubscription(subscription)
                .build();

        BenefitCalculation saved = benefitCalculationRepository.save(calc);
        log.info("Benefit calculation saved with ID: {}", saved.getCalculationId());
        return mapToResponse(saved);
    }

    private BenefitCalculationResponse mapToResponse(BenefitCalculation calc) {
        return BenefitCalculationResponse.builder()
                .calculationId(calc.getCalculationId())
                .calculationDate(calc.getCalculationDate())
                .baseAmount(calc.getBaseAmount())
                .loyaltyBonus(calc.getLoyaltyBonus())
                .guaranteedAddition(calc.getGuaranteedAddition())
                .annualIncrement(calc.getAnnualIncrement())
                .totalBenefit(calc.getTotalBenefit())
                .benefitType(calc.getBenefitType())
                .subscriptionId(calc.getPolicySubscription().getSubscriptionId())
                .build();
    }
}
