package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Claim Repository for claim management
 */
@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByPolicySubscriptionSubscriptionId(Long subscriptionId);

    Page<Claim> findByUserUserId(Long userId, Pageable pageable);

    List<Claim> findByStatus(String status);

    List<Claim> findByClaimType(String claimType);

    @Query("SELECT c FROM Claim c WHERE c.claimDate BETWEEN :startDate AND :endDate")
    List<Claim> findClaimsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Claim> findByClaimAmountGreaterThanEqual(BigDecimal amount);

    @Query("SELECT c FROM Claim c WHERE c.user.userId = :userId AND c.status = :status")
    List<Claim> findClaimsByUserAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT COALESCE(SUM(c.claimAmount), 0) FROM Claim c WHERE c.status = 'APPROVED'")
    BigDecimal calculateTotalApprovedClaimAmount();

    @Query("SELECT COUNT(c) FROM Claim c WHERE c.user.userId = :userId AND c.status = :status")
    long countClaimsByStatus(@Param("userId") Long userId, @Param("status") String status);

    long countByPolicySubscriptionSubscriptionId(Long subscriptionId);

    /**
     * Count claims by status (global, for dashboard)
     */
    long countByStatus(String status);
}
