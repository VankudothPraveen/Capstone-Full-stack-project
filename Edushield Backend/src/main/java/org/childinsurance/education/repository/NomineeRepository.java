package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Nominee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NomineeRepository extends JpaRepository<Nominee, Long> {

    Optional<Nominee> findByPolicyApplicationApplicationId(Long applicationId);
    Optional<Nominee> findByNomineeName(String nomineeName);
    Optional<Nominee> findByRelationship(String relationship);
    Optional<Nominee> findByPhone(String phone);
    boolean existsByPolicyApplicationApplicationId(Long applicationId);

    @Query("SELECT n FROM Nominee n WHERE n.policyApplication.user.userId = :userId")
    Page<Nominee> findByUserId(Long userId, Pageable pageable);
}
