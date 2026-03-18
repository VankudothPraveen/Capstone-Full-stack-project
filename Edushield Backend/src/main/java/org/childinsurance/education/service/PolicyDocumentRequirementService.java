package org.childinsurance.education.service;

import org.childinsurance.education.dto.document.PolicyDocumentRequirementRequest;
import org.childinsurance.education.dto.document.PolicyDocumentRequirementResponse;
import org.childinsurance.education.entity.Policy;
import org.childinsurance.education.entity.PolicyDocumentRequirement;
import org.childinsurance.education.repository.PolicyDocumentRequirementRepository;
import org.childinsurance.education.repository.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyDocumentRequirementService {

    @Autowired
    private PolicyDocumentRequirementRepository requirementRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Transactional
    public PolicyDocumentRequirementResponse createRequirement(PolicyDocumentRequirementRequest request) {
        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(request.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        PolicyDocumentRequirement requirement = PolicyDocumentRequirement.builder()
                .policy(policy)
                .documentType(request.getDocumentType())
                .stage(request.getStage().toUpperCase())
                .build();

        requirement = requirementRepository.save(requirement);
        return mapToResponse(requirement);
    }

    public List<PolicyDocumentRequirementResponse> getRequirementsForPolicy(Long policyId, String stage) {
        List<PolicyDocumentRequirement> reqs = requirementRepository.findByPolicy_PolicyIdAndStage(policyId,
                stage.toUpperCase());

        if (reqs.isEmpty()) {
            if ("APPLICATION".equalsIgnoreCase(stage)) {
                return List.of(
                        PolicyDocumentRequirementResponse.builder().policyId(policyId).documentType("ID Proof")
                                .stage("APPLICATION").build(),
                        PolicyDocumentRequirementResponse.builder().policyId(policyId).documentType("Age Proof")
                                .stage("APPLICATION").build());
            } else if ("CLAIM".equalsIgnoreCase(stage)) {
                return List.of(
                        PolicyDocumentRequirementResponse.builder().policyId(policyId).documentType("Claim Form")
                                .stage("CLAIM").build(),
                        PolicyDocumentRequirementResponse.builder().policyId(policyId)
                                .documentType("Proof of Occurrence").stage("CLAIM").build());
            }
        }

        return reqs.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRequirement(Long id) {
        if (!requirementRepository.existsById(id)) {
            throw new RuntimeException("Requirement not found");
        }
        requirementRepository.deleteById(id);
    }

    private PolicyDocumentRequirementResponse mapToResponse(PolicyDocumentRequirement requirement) {
        return PolicyDocumentRequirementResponse.builder()
                .id(requirement.getId())
                .policyId(requirement.getPolicy().getPolicyId())
                .documentType(requirement.getDocumentType())
                .stage(requirement.getStage())
                .build();
    }
}

