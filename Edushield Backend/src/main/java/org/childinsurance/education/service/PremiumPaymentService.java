package org.childinsurance.education.service;

import org.childinsurance.education.dto.payment.PremiumPaymentRequest;
import org.childinsurance.education.dto.payment.PremiumPaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Premium Payment Service Interface
 */
public interface PremiumPaymentService {
    /**
     * Process premium payment
     */
    PremiumPaymentResponse payPremium(PremiumPaymentRequest request);

    /**
     * Get payment history for an application
     */
    Page<PremiumPaymentResponse> getPaymentsByApplication(Long applicationId, Pageable pageable);

    /**
     * Get all payments of logged-in user
     */
    Page<PremiumPaymentResponse> getMyPayments(Pageable pageable);

    /**
     * Get payment by ID
     */
    PremiumPaymentResponse getPaymentById(Long paymentId);
}

