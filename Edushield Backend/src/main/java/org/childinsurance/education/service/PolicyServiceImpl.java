package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.policy.PolicyRequest;
import org.childinsurance.education.dto.policy.PolicyResponse;
import org.childinsurance.education.entity.Policy;
import org.childinsurance.education.repository.PolicyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public Page<PolicyResponse> getAllPolicies(Pageable pageable) {
        log.info("Fetching all policies with pagination");
        return policyRepository.findByDeletedFalse(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PolicyResponse getPolicyById(Long policyId) {
        log.info("Fetching policy with ID: {}", policyId);
        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(policyId)
                .orElseThrow(() -> {
                    log.error("Policy not found with ID: {}", policyId);
                    return new RuntimeException("Policy not found with ID: " + policyId);
                });
        return mapToResponse(policy);
    }

    @Override
    public PolicyResponse createPolicy(PolicyRequest request) {
        log.info("Creating new policy: {}", request.getPolicyName());

        Policy policy = Policy.builder()
                .policyName(request.getPolicyName())
                .basePremium(request.getBasePremium())
                .durationYears(request.getDurationYears())
                .bonusPercentage(request.getBonusPercentage())
                .riskCoverageAmount(request.getRiskCoverageAmount())
                .minChildAge(request.getMinChildAge() != null ? request.getMinChildAge() : 0)
                .maxChildAge(request.getMaxChildAge() != null ? request.getMaxChildAge() : 18)
                .maturityBenefitAmount(request.getMaturityBenefitAmount())
                .deathBenefitMultiplier(request.getDeathBenefitMultiplier())
                .waiverOfPremium(request.getWaiverOfPremium() != null ? request.getWaiverOfPremium() : false)
                .isActive(true)
                .description(request.getDescription())
                .build();

        Policy savedPolicy = policyRepository.save(policy);
        log.info("Policy created successfully with ID: {}", savedPolicy.getPolicyId());

        // Audit: Policy Created
        auditLogService.logAction("POLICY_CREATED", "Policy", savedPolicy.getPolicyId(),
                "Admin created policy: " + savedPolicy.getPolicyName());

        // Notification: Broadcast to all users
        notificationService.createNotification(null, "USER", "New Policy Available!", 
                "Check out our new policy: " + savedPolicy.getPolicyName(), 
                "POLICY", "/policies/catalog");

        return mapToResponse(savedPolicy);
    }

    @Override
    public PolicyResponse updatePolicy(Long policyId, PolicyRequest request) {
        log.info("Updating policy with ID: {}", policyId);

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> {
                    log.error("Policy not found with ID: {}", policyId);
                    return new RuntimeException("Policy not found");
                });

        policy.setPolicyName(request.getPolicyName());
        policy.setBasePremium(request.getBasePremium());
        policy.setDurationYears(request.getDurationYears());
        policy.setBonusPercentage(request.getBonusPercentage());
        policy.setRiskCoverageAmount(request.getRiskCoverageAmount());
        if (request.getMinChildAge() != null)
            policy.setMinChildAge(request.getMinChildAge());
        if (request.getMaxChildAge() != null)
            policy.setMaxChildAge(request.getMaxChildAge());
        if (request.getMaturityBenefitAmount() != null)
            policy.setMaturityBenefitAmount(request.getMaturityBenefitAmount());
        if (request.getDeathBenefitMultiplier() != null)
            policy.setDeathBenefitMultiplier(request.getDeathBenefitMultiplier());
        if (request.getWaiverOfPremium() != null)
            policy.setWaiverOfPremium(request.getWaiverOfPremium());
        if (request.getIsActive() != null)
            policy.setIsActive(request.getIsActive());
        if (request.getDescription() != null)
            policy.setDescription(request.getDescription());

        Policy updatedPolicy = policyRepository.save(policy);
        log.info("Policy updated successfully");

        // Audit: Policy Updated
        auditLogService.logAction("POLICY_UPDATED", "Policy", policyId,
                "Admin updated policy: " + updatedPolicy.getPolicyName());

        return mapToResponse(updatedPolicy);
    }

    @Override
    public void deletePolicy(Long policyId) {
        log.info("Soft-deleting policy with ID: {}", policyId);

        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(policyId)
                .orElseThrow(() -> {
                    log.error("Policy not found with ID: {}", policyId);
                    return new RuntimeException("Policy not found with ID: " + policyId);
                });

        // Soft delete: mark as deleted and deactivate so no new applications can be made
        policy.setDeleted(true);
        policy.setIsActive(false);
        policyRepository.save(policy);
        log.info("Policy soft-deleted successfully with ID: {}", policyId);
    }

    @Override
    public PolicyResponse activatePolicy(Long policyId) {
        log.info("Activating policy with ID: {}", policyId);
        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found with ID: " + policyId));
        policy.setIsActive(true);
        Policy saved = policyRepository.save(policy);
        log.info("Policy activated successfully");

        // Notification: Broadcast to all users
        notificationService.createNotification(null, "USER", "Policy Activated", 
                "The policy " + saved.getPolicyName() + " is now available for application.", 
                "POLICY", "/policies/catalog");
        return mapToResponse(saved);
    }

    @Override
    public PolicyResponse deactivatePolicy(Long policyId) {
        log.info("Deactivating policy with ID: {}", policyId);
        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found with ID: " + policyId));
        policy.setIsActive(false);
        Policy saved = policyRepository.save(policy);
        log.info("Policy deactivated successfully");
        return mapToResponse(saved);
    }

    private PolicyResponse mapToResponse(Policy policy) {
        return PolicyResponse.builder()
                .policyId(policy.getPolicyId())
                .policyName(policy.getPolicyName())
                .basePremium(policy.getBasePremium())
                .durationYears(policy.getDurationYears())
                .bonusPercentage(policy.getBonusPercentage())
                .riskCoverageAmount(policy.getRiskCoverageAmount())
                .minChildAge(policy.getMinChildAge())
                .maxChildAge(policy.getMaxChildAge())
                .maturityBenefitAmount(policy.getMaturityBenefitAmount())
                .deathBenefitMultiplier(policy.getDeathBenefitMultiplier())
                .waiverOfPremium(policy.getWaiverOfPremium())
                .isActive(policy.getIsActive())
                .description(policy.getDescription())
                .build();
    }
}



