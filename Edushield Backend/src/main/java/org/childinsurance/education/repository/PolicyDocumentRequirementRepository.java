package org.childinsurance.education.repository;

import org.childinsurance.education.entity.PolicyDocumentRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyDocumentRequirementRepository extends JpaRepository<PolicyDocumentRequirement, Long> {
    List<PolicyDocumentRequirement> findByPolicy_PolicyIdAndStage(Long policyId, String stage);
}
