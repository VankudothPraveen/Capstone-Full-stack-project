package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPolicyApplication_ApplicationId(Long applicationId);

    List<Document> findByClaim_ClaimId(Long claimId);
}
