package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.subscription.PolicySubscriptionResponse;
import org.childinsurance.education.entity.PolicySubscription;
import org.childinsurance.education.repository.PolicySubscriptionRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class PolicySubscriptionServiceImpl implements PolicySubscriptionService {

    private final PolicySubscriptionRepository policySubscriptionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PolicySubscriptionResponse> getMySubscriptions(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching subscriptions for user: {}", userId);
        return policySubscriptionRepository.findByPolicyApplicationUserUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PolicySubscriptionResponse getSubscriptionById(Long subscriptionId) {
        log.info("Fetching subscription with ID: {}", subscriptionId);
        PolicySubscription subscription = policySubscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        return mapToResponse(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public PolicySubscriptionResponse getSubscriptionByApplicationId(Long applicationId) {
        log.info("Fetching subscription for application ID: {}", applicationId);
        PolicySubscription subscription = policySubscriptionRepository.findByPolicyApplicationApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Subscription not found for this application"));
        return mapToResponse(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PolicySubscriptionResponse> getAllSubscriptions(Pageable pageable) {
        log.info("Fetching all subscriptions");
        return policySubscriptionRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public void processMaturedSubscriptions() {
        log.info("Processing matured subscriptions");

        LocalDate today = LocalDate.now();
        List<PolicySubscription> activeSubscriptions = policySubscriptionRepository.findByStatus("ACTIVE");

        int maturedCount = 0;
        for (PolicySubscription subscription : activeSubscriptions) {
            if (subscription.getMaturityDate().isBefore(today) ||
                subscription.getMaturityDate().isEqual(today)) {
                subscription.setStatus("MATURED");
                policySubscriptionRepository.save(subscription);
                log.info("Subscription {} has matured. Status updated to MATURED",
                        subscription.getSubscriptionNumber());
                maturedCount++;
            }
        }

        log.info("Processed {} matured subscriptions", maturedCount);
    }

    private PolicySubscriptionResponse mapToResponse(PolicySubscription subscription) {
        return PolicySubscriptionResponse.builder()
                .subscriptionId(subscription.getSubscriptionId())
                .subscriptionNumber(subscription.getSubscriptionNumber())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .maturityDate(subscription.getMaturityDate())
                .coverageAmount(subscription.getCoverageAmount())
                .premiumAmount(subscription.getPremiumAmount())
                .status(subscription.getStatus())
                .totalPaidAmount(subscription.getTotalPaidAmount())
                .applicationId(subscription.getPolicyApplication().getApplicationId())
                .policyName(subscription.getPolicyApplication().getPolicy().getPolicyName())
                .childName(subscription.getPolicyApplication().getChild().getChildName())
                .build();
    }
}
