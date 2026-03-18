package org.childinsurance.education.repository;

import org.childinsurance.education.entity.BenefitCalculation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenefitCalculationRepository extends JpaRepository<BenefitCalculation, Long> {

    @Query("SELECT bc FROM BenefitCalculation bc WHERE bc.policySubscription.subscriptionId = :subscriptionId ORDER BY bc.calculationDate DESC")
    List<BenefitCalculation> findBySubscriptionId(Long subscriptionId);

    @Query("SELECT bc FROM BenefitCalculation bc WHERE bc.policySubscription.policyApplication.user.userId = :userId ORDER BY bc.calculationDate DESC")
    Page<BenefitCalculation> findByUserId(Long userId, Pageable pageable);
}
