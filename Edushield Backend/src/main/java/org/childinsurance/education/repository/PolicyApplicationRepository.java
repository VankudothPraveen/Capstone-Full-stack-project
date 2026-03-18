package org.childinsurance.education.repository;

import org.childinsurance.education.entity.PolicyApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Policy Application Repository for policy applications
 */
@Repository
public interface PolicyApplicationRepository extends JpaRepository<PolicyApplication, Long> {
    /**
     * Find a policy application by policy number
     * 
     * @param policyNumber the policy number
     * @return Optional containing the policy application if found
     */
    Optional<PolicyApplication> findByPolicyNumber(String policyNumber);

    /**
     * Find all policy applications for a specific user
     * 
     * @param userId the ID of the user
     * @return List of policy applications for that user
     */
    List<PolicyApplication> findByUserUserId(Long userId);

    /**
     * Find all policy applications for a specific user with pagination
     * 
     * @param userId   the ID of the user
     * @param pageable pagination info
     * @return Page of policy applications for that user
     */
    Page<PolicyApplication> findByUserUserId(Long userId, Pageable pageable);

    /**
     * Find all policy applications for a specific child
     * 
     * @param childId the ID of the child
     * @return List of policy applications for that child
     */
    List<PolicyApplication> findByChildChildId(Long childId);

    /**
     * Find all policy applications for a specific policy
     * 
     * @param policyId the ID of the policy
     * @return List of policy applications for that policy
     */
    List<PolicyApplication> findByPolicyPolicyId(Long policyId);

    /**
     * Find policy applications by status
     * 
     * @param status the status (ACTIVE, PENDING, CANCELLED, etc.)
     * @return List of policy applications with that status
     */
    List<PolicyApplication> findByStatus(String status);

    /**
     * Find policy applications by start date
     * 
     * @param startDate the start date
     * @return List of policy applications starting on that date
     */
    List<PolicyApplication> findByStartDate(LocalDate startDate);

    /**
     * Find policy applications by end date
     * 
     * @param endDate the end date
     * @return List of policy applications ending on that date
     */
    List<PolicyApplication> findByEndDate(LocalDate endDate);

    /**
     * Find policy applications with expiry date before a given date
     * 
     * @param expiryDate the expiry date
     * @return List of expired policy applications
     */
    @Query("SELECT pa FROM PolicyApplication pa WHERE pa.endDate < :expiryDate")
    List<PolicyApplication> findExpiredApplications(@Param("expiryDate") LocalDate expiryDate);

    /**
     * Find policy applications starting between two dates
     * 
     * @param startDate the start date
     * @param endDate   the end date
     * @return List of policy applications starting between the dates
     */
    @Query("SELECT pa FROM PolicyApplication pa WHERE pa.startDate BETWEEN :startDate AND :endDate")
    List<PolicyApplication> findApplicationsStartedBetween(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Count active policy applications for a user
     * 
     * @param year   the year
     * @param status the status to count
     * @return Number of active applications for that user
     */
    @Query("SELECT COUNT(pa) FROM PolicyApplication pa WHERE YEAR(pa.startDate) = :year AND pa.status = :status")
    long countActiveApplications(@Param("year") int year, @Param("status") String status);

    /**
     * Count total policy applications
     * 
     * @return Total count of policy applications
     */
    long count();

    /**
     * Count applications by status
     */
    long countByStatus(String status);
    
    /**
     * Check if child already applied for same policy
     */
    boolean existsByChildChildIdAndPolicyPolicyIdAndStatusIn(Long childId, Long policyId, java.util.List<String> statuses);

    @Query("SELECT pa.policy.policyName, COUNT(pa) FROM PolicyApplication pa GROUP BY pa.policy.policyName")
    List<Object[]> findPolicyDistribution();
}
