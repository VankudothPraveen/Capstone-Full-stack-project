package org.childinsurance.education.service;

import org.childinsurance.education.dto.policy.PolicyRequest;
import org.childinsurance.education.dto.policy.PolicyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Policy Service Interface
 */
public interface PolicyService {
    Page<PolicyResponse> getAllPolicies(Pageable pageable);
    PolicyResponse getPolicyById(Long policyId);
    PolicyResponse createPolicy(PolicyRequest request);
    PolicyResponse updatePolicy(Long policyId, PolicyRequest request);
    void deletePolicy(Long policyId);
    PolicyResponse activatePolicy(Long policyId);
    PolicyResponse deactivatePolicy(Long policyId);
}
