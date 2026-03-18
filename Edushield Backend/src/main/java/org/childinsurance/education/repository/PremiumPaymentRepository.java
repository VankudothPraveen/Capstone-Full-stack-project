package org.childinsurance.education.repository;

import org.childinsurance.education.entity.PremiumPayment;
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
 * Premium Payment Repository for premium payments
 */
@Repository
public interface PremiumPaymentRepository extends JpaRepository<PremiumPayment, Long> {
    /**
     * Find all premium payments for a specific policy application
     */
    List<PremiumPayment> findByPolicyApplicationApplicationId(Long applicationId);

    /**
     * Find all premium payments for a specific policy application with pagination
     */
    Page<PremiumPayment> findByPolicyApplicationApplicationId(Long applicationId, Pageable pageable);

    /**
     * Find premium payments by user ID with pagination
     */
    @Query("SELECT pp FROM PremiumPayment pp WHERE pp.policySubscription.policyApplication.user.userId = :userId")
    Page<PremiumPayment> findByPolicySubscriptionPolicyApplicationUserUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * Find premium payments by status
     */
    List<PremiumPayment> findByStatus(String status);

    /**
     * Find premium payments by payment date
     */
    List<PremiumPayment> findByPaymentDate(LocalDate paymentDate);

    /**
     * Find premium payments due before a specific date
     */
    @Query("SELECT pp FROM PremiumPayment pp WHERE pp.dueDate < :dueDate AND pp.status != 'PAID'")
    List<PremiumPayment> findOverduePayments(@Param("dueDate") LocalDate dueDate);

    /**
     * Find premium payments made between two dates
     */
    @Query("SELECT pp FROM PremiumPayment pp WHERE pp.paymentDate BETWEEN :startDate AND :endDate")
    List<PremiumPayment> findPaymentsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find premium payments with amount greater than or equal to a value
     */
    List<PremiumPayment> findByAmountGreaterThanEqual(BigDecimal amount);

    /**
     * Calculate total amount paid
     */
    @Query("SELECT COALESCE(SUM(pp.amount), 0) FROM PremiumPayment pp WHERE pp.status = 'PAID'")
    BigDecimal calculateTotalPremiumCollected();

    /**
     * Count paid premiums for a policy application
     */
    @Query("SELECT COUNT(pp) FROM PremiumPayment pp WHERE pp.policyApplication.applicationId = :applicationId AND pp.status = 'PAID'")
    long countPaidPremiums(@Param("applicationId") Long applicationId);

    /**
     * Count overdue premiums for a policy application
     */
    @Query("SELECT COUNT(pp) FROM PremiumPayment pp WHERE pp.policyApplication.applicationId = :applicationId AND pp.dueDate < CURRENT_DATE AND pp.status != 'PAID'")
    long countOverduePremiums(@Param("applicationId") Long applicationId);

    @Query("SELECT COALESCE(AVG(pp.amount), 0) FROM PremiumPayment pp WHERE pp.status = 'PAID'")
    BigDecimal calculateAveragePremium();

    @Query("SELECT FORMATDATETIME(pp.paymentDate, 'yyyy-MM') as month, SUM(pp.amount) FROM PremiumPayment pp WHERE pp.status = 'PAID' GROUP BY month ORDER BY month ASC")
    List<Object[]> findMonthlyRevenue();
}

