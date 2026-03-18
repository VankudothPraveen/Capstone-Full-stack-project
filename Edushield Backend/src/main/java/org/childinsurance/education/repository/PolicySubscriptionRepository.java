package org.childinsurance.education.repository;

import org.childinsurance.education.entity.PolicySubscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicySubscriptionRepository extends JpaRepository<PolicySubscription, Long> {

    Optional<PolicySubscription> findBySubscriptionNumber(String subscriptionNumber);

    @Query("SELECT ps FROM PolicySubscription ps WHERE ps.policyApplication.user.userId = :userId")
    Page<PolicySubscription> findByUserId(Long userId, Pageable pageable);

    Page<PolicySubscription> findByPolicyApplicationUserUserId(Long userId, Pageable pageable);

    List<PolicySubscription> findByStatus(String status);

    @Query("SELECT ps FROM PolicySubscription ps WHERE ps.status = :status")
    Page<PolicySubscription> findByStatusPaged(String status, Pageable pageable);

    @Query("SELECT ps FROM PolicySubscription ps WHERE ps.maturityDate <= :date AND ps.status = 'ACTIVE'")
    List<PolicySubscription> findMaturedSubscriptions(LocalDate date);

    @Query("SELECT COUNT(ps) FROM PolicySubscription ps WHERE ps.status = 'ACTIVE'")
    Long countActiveSubscriptions();

    Optional<PolicySubscription> findByPolicyApplicationApplicationId(Long applicationId);
    
    boolean existsByPolicyApplicationApplicationId(Long applicationId);
}
