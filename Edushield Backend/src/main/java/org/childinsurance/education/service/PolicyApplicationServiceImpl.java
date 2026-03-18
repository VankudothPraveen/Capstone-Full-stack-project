package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.application.PolicyApplicationRequest;
import org.childinsurance.education.dto.application.PolicyApplicationResponse;
import org.childinsurance.education.entity.*;
import org.childinsurance.education.repository.*;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.childinsurance.education.dto.risk.RiskCalculationRequest;
import org.childinsurance.education.dto.risk.RiskCalculationResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class PolicyApplicationServiceImpl implements PolicyApplicationService {

    private final PolicyApplicationRepository policyApplicationRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final PolicySubscriptionRepository policySubscriptionRepository;
    private final RiskAssessmentService riskAssessmentService;
    private final EmailService emailService;
    private final PdfService pdfService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public PolicyApplicationResponse applyForPolicy(PolicyApplicationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("User {} applying for policy {}", userId, request.getPolicyId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Policy policy = policyRepository.findByPolicyIdAndDeletedFalse(request.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        if (!Boolean.TRUE.equals(policy.getIsActive())) {
            throw new RuntimeException("This policy is discontinued and not available for new applications");
        }
        Child child = childRepository.findById(request.getChildId())
                .orElseThrow(() -> new RuntimeException("Child not found"));

        if (policyApplicationRepository.existsByChildChildIdAndPolicyPolicyIdAndStatusIn(
                child.getChildId(), policy.getPolicyId(), java.util.Arrays.asList("PENDING", "APPROVED", "ACTIVE"))) {
            throw new RuntimeException("An application for this policy already exists for the selected child.");
        }

        if (request.getAnnualIncome() != null && request.getCoverageAmount() != null) {
            BigDecimal maxCoverage = request.getAnnualIncome().multiply(new BigDecimal("5"));
            if (request.getCoverageAmount().compareTo(maxCoverage) > 0) {
                throw new RuntimeException("Desired coverage amount cannot exceed 5x of the user income.");
            }
        }

        String policyNumber = "POL-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);

        RiskCalculationResponse riskData = null;
        if (request.getAnnualIncome() != null && request.getCoverageAmount() != null) {
            RiskCalculationRequest riskReq = new RiskCalculationRequest();
            riskReq.setParentAge(request.getParentAge());
            riskReq.setOccupation(request.getOccupation());
            riskReq.setAnnualIncome(request.getAnnualIncome());
            riskReq.setCoverageAmount(request.getCoverageAmount());
            riskReq.setPolicyId(request.getPolicyId());

            riskData = riskAssessmentService.calculateRisk(riskReq);
            
            if (riskData != null && riskData.getCalculatedPremium() != null) {
                if (riskData.getCalculatedPremium().compareTo(policy.getBasePremium()) < 0) {
                    riskData.setCalculatedPremium(policy.getBasePremium());
                }
            }
        }

        PolicyApplication application = PolicyApplication.builder()
                .policyNumber(policyNumber)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status("PENDING")
                .paymentFrequency(request.getPaymentFrequency())
                .applicationDate(LocalDate.now())
                .totalPaidAmount(BigDecimal.ZERO)
                .riskScore(riskData != null ? riskData.getRiskScore() : null)
                .riskCategory(riskData != null ? riskData.getRiskCategory() : null)
                .calculatedPremium(riskData != null ? riskData.getCalculatedPremium() : null)
                .user(user)
                .policy(policy)
                .child(child)
                .build();

        PolicyApplication savedApplication = policyApplicationRepository.save(application);
        log.info("Policy application created successfully with number: {}", policyNumber);

        // Audit: Application Submitted
        auditLogService.logAction(user.getUserId(), user.getEmail(), user.getRole().getRoleName(),
                "APPLICATION_SUBMITTED", "PolicyApplication", savedApplication.getApplicationId(),
                "Application submitted for policy: " + policy.getPolicyName() + " for child: " + child.getChildName());

        // Send application-submitted email notification
        emailService.sendApplicationSubmittedEmail(
                user.getEmail(),
                user.getName(),
                savedApplication.getApplicationId(),
                policy.getPolicyName()
        );
        
        // Notification: Notify Admin and Underwriter
        notificationService.createNotification(null, "ADMIN", "New Application", 
                "A new application #" + savedApplication.getApplicationId() + " has been submitted by " + user.getName(), 
                "APPLICATION", "/admin/applications?appId=" + savedApplication.getApplicationId());
        notificationService.createNotification(null, "UNDERWRITER", "New Application", 
                "A new application #" + savedApplication.getApplicationId() + " requires assessment.", 
                "APPLICATION", "/underwriter/applications?appId=" + savedApplication.getApplicationId());

        return mapToResponse(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PolicyApplicationResponse> getMyApplications(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching applications for user: {}", userId);
        return policyApplicationRepository.findByUserUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PolicyApplicationResponse> getAllApplications(Pageable pageable) {
        log.info("Fetching all applications");
        return policyApplicationRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PolicyApplicationResponse getApplicationById(Long applicationId) {
        log.info("Fetching application with ID: {}", applicationId);
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> {
                    log.error("Application not found with ID: {}", applicationId);
                    return new RuntimeException("Application not found");
                });
        return mapToResponse(application);
    }

    @Override
    public PolicyApplicationResponse approveApplication(Long applicationId, BigDecimal revisedPremium) {
        log.info("Approving application with ID: {}", applicationId);
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"PENDING".equals(application.getStatus())) {
            throw new RuntimeException("Only PENDING applications can be approved");
        }

        if (revisedPremium != null) {
            application.setCalculatedPremium(revisedPremium);
        }

        application.setStatus("APPROVED");
        application.setApprovalDate(LocalDate.now());
        PolicyApplication updatedApplication = policyApplicationRepository.save(application);

        // Check if subscription already exists to prevent Unique Index violation
        PolicySubscription subscription;
        if (!policySubscriptionRepository.existsByPolicyApplicationApplicationId(applicationId)) {
            subscription = createSubscriptionForApprovedApplication(updatedApplication);
        } else {
            subscription = policySubscriptionRepository.findByPolicyApplicationApplicationId(applicationId).get();
            log.warn("Subscription already exists for application ID: {}", applicationId);
        }

        try {
            // Generate PDF Certificate
            byte[] pdfBytes = pdfService.generatePolicyCertificate(updatedApplication, subscription);

            // Send application-approved email notification with PDF attachment
            String emailBody = "Dear " + updatedApplication.getUser().getName() + ",\n\n"
                    + "Congratulations! Your policy application for '" + updatedApplication.getPolicy().getPolicyName() + "' has been approved.\n"
                    + "Please find your official Policy Certificate attached to this email.\n\n"
                    + "Best regards,\nEduShield Insurance Team";

            emailService.sendEmailWithAttachment(
                    updatedApplication.getUser().getEmail(),
                    "Your Policy Application Has Been Approved - Certificate Attached",
                    emailBody,
                    pdfBytes,
                    "Policy_Certificate_APP-" + updatedApplication.getApplicationId() + ".pdf"
            );
        } catch (Exception e) {
            log.error("Failed to generate or send PDF certificate: {}", e.getMessage(), e);
            // Fallback to standard email if PDF generation fails
            emailService.sendApplicationApprovedEmail(
                    updatedApplication.getUser().getEmail(),
                    updatedApplication.getUser().getName(),
                    updatedApplication.getApplicationId(),
                    updatedApplication.getPolicy().getPolicyName()
            );
        }
        
        // Notification: Notify User
        notificationService.createNotification(updatedApplication.getUser().getUserId(), "USER", "Application Approved", 
                "Your application for " + updatedApplication.getPolicy().getPolicyName() + " has been approved!", 
                "APPLICATION", "/applications/" + updatedApplication.getApplicationId() + "/details");

        log.info("Application approved and subscription created successfully");

        // Audit: Application Approved
        auditLogService.logAction("APPROVED_APPLICATION", "PolicyApplication",
                applicationId, "Underwriter approved policy application #" + applicationId);

        return mapToResponse(updatedApplication);
    }

    private PolicySubscription createSubscriptionForApprovedApplication(PolicyApplication application) {
        Policy policy = application.getPolicy();
        String subscriptionNumber = "SUB-" + System.currentTimeMillis() + "-"
                + UUID.randomUUID().toString().substring(0, 8);

        PolicySubscription subscription = PolicySubscription.builder()
                .subscriptionNumber(subscriptionNumber)
                .startDate(application.getStartDate())
                .endDate(application.getEndDate())
                .maturityDate(application.getStartDate().plusYears(policy.getDurationYears()))
                .coverageAmount(policy.getRiskCoverageAmount())
                .premiumAmount(application.getCalculatedPremium() != null ? application.getCalculatedPremium() : policy.getBasePremium())
                .status("PENDING_PAYMENT")
                .totalPaidAmount(BigDecimal.ZERO)
                .policyApplication(application)
                .build();

        PolicySubscription savedSubscription = policySubscriptionRepository.save(subscription);
        log.info("PolicySubscription created with number: {} for application ID: {}", subscriptionNumber, application.getApplicationId());
        
        return savedSubscription;
    }

    @Override
    public PolicyApplicationResponse rejectApplication(Long applicationId, String rejectionReason) {
        log.info("Rejecting application with ID: {}", applicationId);
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"PENDING".equals(application.getStatus())) {
            throw new RuntimeException("Only PENDING applications can be rejected");
        }

        application.setStatus("REJECTED");
        application.setRejectionReason(rejectionReason != null ? rejectionReason : "Not specified");
        PolicyApplication updatedApplication = policyApplicationRepository.save(application);

        // Send application-rejected email notification
        emailService.sendApplicationRejectedEmail(
                updatedApplication.getUser().getEmail(),
                updatedApplication.getUser().getName()
        );
        
        // Notification: Notify User
        notificationService.createNotification(updatedApplication.getUser().getUserId(), "USER", "Application Rejected", 
                "Your application for " + updatedApplication.getPolicy().getPolicyName() + " was unfortunately rejected.", 
                "APPLICATION", "/applications/" + updatedApplication.getApplicationId() + "/details");

        log.info("Application rejected successfully");

        // Audit: Application Rejected
        auditLogService.logAction("REJECTED_APPLICATION", "PolicyApplication",
                applicationId, "Underwriter rejected policy application #" + applicationId
                + (rejectionReason != null ? ". Reason: " + rejectionReason : ""));

        return mapToResponse(updatedApplication);
    }

    @Override
    public PolicyApplicationResponse cancelApplication(Long applicationId) {
        log.info("Cancelling application with ID: {}", applicationId);
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getStatus().equals("PENDING") && !application.getStatus().equals("APPROVED")) {
            throw new RuntimeException("Cannot cancel application with status: " + application.getStatus());
        }

        application.setStatus("CANCELLED");
        PolicyApplication updatedApplication = policyApplicationRepository.save(application);

        log.info("Application cancelled successfully");
        return mapToResponse(updatedApplication);
    }

    @Override
    public PolicyApplicationResponse updateApplicationStatus(Long applicationId, String status) {
        log.info("Updating application {} status to {}", applicationId, status);
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status.toUpperCase());
        if ("APPROVED".equalsIgnoreCase(status)) {
            application.setApprovalDate(LocalDate.now());
        }
        PolicyApplication updatedApplication = policyApplicationRepository.save(application);

        log.info("Application status updated to {}", status);
        return mapToResponse(updatedApplication);
    }

    private PolicyApplicationResponse mapToResponse(PolicyApplication application) {
        return PolicyApplicationResponse.builder()
                .applicationId(application.getApplicationId())
                .policyNumber(application.getPolicyNumber())
                .startDate(application.getStartDate())
                .endDate(application.getEndDate())
                .status(application.getStatus())
                .paymentFrequency(application.getPaymentFrequency())
                .applicationDate(application.getApplicationDate())
                .approvalDate(application.getApprovalDate())
                .rejectionReason(application.getRejectionReason())
                .totalPaidAmount(application.getTotalPaidAmount())
                .userId(application.getUser().getUserId())
                .policyId(application.getPolicy().getPolicyId())
                .childId(application.getChild().getChildId())
                .policyName(application.getPolicy().getPolicyName())
                .childName(application.getChild().getChildName())
                .riskScore(application.getRiskScore() != null ? application.getRiskScore() : 0)
                .riskCategory(application.getRiskCategory() != null ? application.getRiskCategory() : "STANDARD")
                .calculatedPremium(application.getCalculatedPremium() != null ? application.getCalculatedPremium() : 
                                  (application.getPolicy() != null ? application.getPolicy().getBasePremium() : null))
                .userName(application.getUser() != null ? application.getUser().getName() : null)
                .basePremium(application.getPolicy() != null ? application.getPolicy().getBasePremium() : null)
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCertificate(Long applicationId) {
        PolicyApplication application = policyApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED".equalsIgnoreCase(application.getStatus()) && !"ACTIVE".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException("Certificate is only available for approved policies.");
        }

        PolicySubscription subscription = policySubscriptionRepository.findByPolicyApplicationApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        try {
            return pdfService.generatePolicyCertificate(application, subscription);
        } catch (Exception e) {
            log.error("Failed to generate PDF certificate for download: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF certificate: " + e.getMessage());
        }
    }
}
