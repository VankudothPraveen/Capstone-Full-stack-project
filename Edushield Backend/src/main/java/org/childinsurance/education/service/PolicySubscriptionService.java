package org.childinsurance.education.service;

import org.childinsurance.education.dto.subscription.PolicySubscriptionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PolicySubscriptionService {
    Page<PolicySubscriptionResponse> getMySubscriptions(Pageable pageable);
    PolicySubscriptionResponse getSubscriptionById(Long subscriptionId);
    PolicySubscriptionResponse getSubscriptionByApplicationId(Long applicationId);
    Page<PolicySubscriptionResponse> getAllSubscriptions(Pageable pageable);
    void processMaturedSubscriptions();
}
