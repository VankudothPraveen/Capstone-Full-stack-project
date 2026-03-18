package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Policy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Policy Repository for policy management
 */
@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    /**
     * Find a policy by name
     * 
     * @param policyName the name of the policy
     * @return Optional containing the policy if found
     */
    Optional<Policy> findByPolicyName(String policyName);

    /**
     * Find policies by duration in years
     * 
     * @param durationYears the duration in years
     * @return List of policies with that duration
     */
    List<Policy> findByDurationYears(Integer durationYears);

    /**
     * Find policies with base premium less than or equal to a value
     * 
     * @param maxPremium the maximum base premium
     * @return List of policies within the premium range
     */
    List<Policy> findByBasePremiumLessThanEqual(BigDecimal maxPremium);

    /**
     * Find policies with risk coverage greater than or equal to a value
     * 
     * @param minCoverage the minimum risk coverage amount
     * @return List of policies with sufficient coverage
     */
    List<Policy> findByRiskCoverageAmountGreaterThanEqual(BigDecimal minCoverage);

    /**
     * Find policies by bonus percentage
     * 
     * @param bonusPercentage the bonus percentage
     * @return List of policies with that bonus percentage
     */
    List<Policy> findByBonusPercentage(BigDecimal bonusPercentage);

    /**
     * Find policies with premium between two values
     * 
     * @param minPremium the minimum premium
     * @param maxPremium the maximum premium
     * @return List of policies in the premium range
     */
    @Query("SELECT p FROM Policy p WHERE p.basePremium BETWEEN :minPremium AND :maxPremium")
    List<Policy> findPoliciesByPremiumRange(@Param("minPremium") BigDecimal minPremium,
            @Param("maxPremium") BigDecimal maxPremium);

    /**
     * Find all non-deleted policies with pagination
     */
    Page<Policy> findByDeletedFalse(Pageable pageable);

    /**
     * Find active and non-deleted policies
     */
    List<Policy> findByIsActiveTrueAndDeletedFalse();

    /**
     * Find by id and not deleted
     */
    java.util.Optional<Policy> findByPolicyIdAndDeletedFalse(Long policyId);
}


