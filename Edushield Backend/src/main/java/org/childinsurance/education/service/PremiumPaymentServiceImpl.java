package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.payment.PremiumPaymentRequest;
import org.childinsurance.education.dto.payment.PremiumPaymentResponse;
import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.entity.PolicySubscription;
import org.childinsurance.education.entity.PremiumPayment;
import org.childinsurance.education.repository.PolicyApplicationRepository;
import org.childinsurance.education.repository.PolicySubscriptionRepository;
import org.childinsurance.education.repository.PremiumPaymentRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.childinsurance.education.service.PremiumPaymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Premium Payment Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class PremiumPaymentServiceImpl implements PremiumPaymentService {

    private final PremiumPaymentRepository premiumPaymentRepository;
    private final PolicySubscriptionRepository policySubscriptionRepository;
    private final PolicyApplicationRepository policyApplicationRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public PremiumPaymentResponse payPremium(PremiumPaymentRequest request) {
        log.info("Processing premium payment for subscription: {}", request.getSubscriptionId());

        PolicySubscription subscription = policySubscriptionRepository.findById(request.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        LocalDate dueDate = request.getPaymentDate().plusMonths(1);
        BigDecimal lateFee = BigDecimal.ZERO;

        // Calculate late fee if payment is late (comparing with due date if it exists,
        // otherwise just today)
        // For simplicity using LocalDate.now() vs dueDate
        if (LocalDate.now().isAfter(dueDate)) {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(dueDate, LocalDate.now());
            lateFee = request.getAmount().multiply(BigDecimal.valueOf(0.05))
                    .multiply(BigDecimal.valueOf(daysLate / 30.0));
        }

        PremiumPayment payment = PremiumPayment.builder()
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .dueDate(dueDate)
                .lateFee(lateFee)
                .status("PAID")
                .policySubscription(subscription)
                .policyApplication(subscription.getPolicyApplication())
                .build();

        PremiumPayment savedPayment = premiumPaymentRepository.save(payment);

        // Update total paid amount in subscription
        BigDecimal newTotal = subscription.getTotalPaidAmount().add(request.getAmount());
        subscription.setTotalPaidAmount(newTotal);

        // Ensure subscription is ACTIVE if payment is made
        if (!"ACTIVE".equals(subscription.getStatus())) {
            subscription.setStatus("ACTIVE");
        }
        policySubscriptionRepository.save(subscription);

        // SYNC: Also update the associated PolicyApplication
        PolicyApplication application = subscription.getPolicyApplication();
        if (application != null) {
            application.setTotalPaidAmount(application.getTotalPaidAmount().add(request.getAmount()));

            // TRANSITION: APPROVED -> ACTIVE (this marks it as activated for the user
            // timeline)
            if ("APPROVED".equals(application.getStatus())) {
                application.setStatus("ACTIVE");
                log.info("PolicyApplication {} status updated to ACTIVE (Activated)", application.getPolicyNumber());
            }
            policyApplicationRepository.save(application);
        }

        log.info("Premium payment processed successfully with ID: {}", savedPayment.getPaymentId());

        // Audit: Premium Payment
        auditLogService.logAction("PREMIUM_PAYMENT", "PremiumPayment", savedPayment.getPaymentId(),
                "Premium payment of ₹" + request.getAmount() + " for subscription #" + request.getSubscriptionId());

        // Notification: Notify Admin
        notificationService.createNotification(null, "ADMIN", "Payment Received", 
                "A premium payment of ₹" + request.getAmount() + " was received for subscription #" + subscription.getSubscriptionNumber(), 
                "PAYMENT", "/admin/payments?subscriptionId=" + subscription.getSubscriptionId());

        return mapToResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PremiumPaymentResponse> getPaymentsByApplication(Long applicationId, Pageable pageable) {
        log.info("Fetching payments for application: {}", applicationId);

        return premiumPaymentRepository.findByPolicyApplicationApplicationId(applicationId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PremiumPaymentResponse> getMyPayments(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching payments for user: {}", userId);

        return premiumPaymentRepository.findByPolicySubscriptionPolicyApplicationUserUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PremiumPaymentResponse getPaymentById(Long paymentId) {
        log.info("Fetching payment with ID: {}", paymentId);

        PremiumPayment payment = premiumPaymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    log.error("Payment not found with ID: {}", paymentId);
                    return new RuntimeException("Payment not found");
                });

        return mapToResponse(payment);
    }

    /**
     * Map PremiumPayment entity to PremiumPaymentResponse DTO
     */
    private PremiumPaymentResponse mapToResponse(PremiumPayment payment) {
        PolicySubscription sub = payment.getPolicySubscription();
        return PremiumPaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .dueDate(payment.getDueDate())
                .lateFee(payment.getLateFee())
                .status(payment.getStatus())
                .subscriptionId(sub.getSubscriptionId())
                .subscriptionNumber(sub.getSubscriptionNumber())
                .policyName(sub.getPolicyApplication().getPolicy().getPolicyName())
                .applicationId(sub.getPolicyApplication().getApplicationId())
                .build();
    }
}