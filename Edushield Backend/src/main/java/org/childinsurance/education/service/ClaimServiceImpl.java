package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.claim.ClaimRequest;
import org.childinsurance.education.dto.claim.ClaimResponse;
import org.childinsurance.education.entity.Claim;
import org.childinsurance.education.entity.PolicySubscription;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.ClaimRepository;
import org.childinsurance.education.repository.PolicySubscriptionRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicySubscriptionRepository policySubscriptionRepository;
    private final UserRepository userRepository;
    private final org.childinsurance.education.repository.PolicyDocumentRequirementRepository documentRequirementRepository;
    private final org.childinsurance.education.repository.DocumentRepository documentRepository;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public ClaimResponse raiseClaim(ClaimRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("User {} raising claim for subscription {}", userId, request.getSubscriptionId());

        PolicySubscription subscription = policySubscriptionRepository.findById(request.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Claim claim = Claim.builder()
                .claimType(request.getClaimType())
                .claimDate(request.getClaimDate())
                .claimAmount(request.getClaimAmount())
                .status("SUBMITTED")
                .policySubscription(subscription)
                .user(user)
                .build();

        Claim savedClaim = claimRepository.save(claim);
        log.info("Claim raised successfully with ID: {}", savedClaim.getClaimId());

        // Audit: Claim Submitted
        auditLogService.logAction(user.getUserId(), user.getEmail(), user.getRole().getRoleName(),
                "CLAIM_SUBMITTED", "Claim", savedClaim.getClaimId(),
                "Claim submitted of type: " + request.getClaimType() + " for amount: " + request.getClaimAmount());

        // Send claim-submitted email notification
        emailService.sendClaimSubmittedEmail(
                user.getEmail(),
                user.getName(),
                savedClaim.getClaimId()
        );
        
        // Notification: Notify Admin and Claims Officer
        notificationService.createNotification(null, "ADMIN", "New Claim", 
                "A new claim #" + savedClaim.getClaimId() + " has been raised by " + user.getName(), 
                "CLAIM", "/admin/claims?claimId=" + savedClaim.getClaimId());
        notificationService.createNotification(null, "CLAIMS_OFFICER", "New Claim", 
                "A new claim #" + savedClaim.getClaimId() + " requires verification.", 
                "CLAIM", "/claims/dashboard?claimId=" + savedClaim.getClaimId());

        return mapToResponse(savedClaim);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClaimResponse> getMyClaims(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching claims for user: {}", userId);

        return claimRepository.findByUserUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClaimResponse> getAllClaims(Pageable pageable) {
        log.info("Fetching all claims");
        return claimRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ClaimResponse getClaimById(Long claimId) {
        log.info("Fetching claim with ID: {}", claimId);

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> {
                    log.error("Claim not found with ID: {}", claimId);
                    return new RuntimeException("Claim not found");
                });

        return mapToResponse(claim);
    }

    @Override
    public ClaimResponse approveClaim(Long claimId, java.math.BigDecimal revisedAmount) {
        log.info("Approving claim with ID: {}, revisedAmount: {}", claimId, revisedAmount);

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus("APPROVED");
        claim.setApprovalDate(LocalDate.now());
        claim.setPayoutDate(LocalDate.now().plusDays(7)); // Payout after 7 days
        
        if (revisedAmount != null) {
            claim.setClaimAmount(revisedAmount);
        }
        
        Claim updatedClaim = claimRepository.save(claim);

        // Send claim-approved email notification
        emailService.sendClaimApprovedEmail(
                updatedClaim.getUser().getEmail(),
                updatedClaim.getUser().getName(),
                updatedClaim.getClaimId()
        );
        
        // Notification: Notify User
        notificationService.createNotification(updatedClaim.getUser().getUserId(), "USER", "Claim Approved", 
                "Your claim #" + updatedClaim.getClaimId() + " for " + updatedClaim.getPolicySubscription().getPolicyApplication().getPolicy().getPolicyName() + " has been approved.", 
                "CLAIM", "/claims/my-claims");

        log.info("Claim approved successfully");

        // Audit: Claim Approved
        auditLogService.logAction("CLAIM_APPROVED", "Claim", claimId,
                "Claims Officer approved claim #" + claimId);

        return mapToResponse(updatedClaim);
    }

    @Override
    public ClaimResponse rejectClaim(Long claimId, String reason) {
        log.info("Rejecting claim with ID: {} for reason: {}", claimId, reason);

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus("REJECTED");
        claim.setRejectionReason(reason);
        Claim updatedClaim = claimRepository.save(claim);

        // Send claim-rejected email notification
        emailService.sendClaimRejectedEmail(
                updatedClaim.getUser().getEmail(),
                updatedClaim.getUser().getName(),
                updatedClaim.getClaimId()
        );
        
        // Notification: Notify User
        notificationService.createNotification(updatedClaim.getUser().getUserId(), "USER", "Claim Rejected", 
                "Your claim #" + updatedClaim.getClaimId() + " has been rejected.", 
                "CLAIM", "/claims/my-claims");

        log.info("Claim rejected successfully");

        // Audit: Claim Rejected
        auditLogService.logAction("CLAIM_REJECTED", "Claim", claimId,
                "Claims Officer rejected claim #" + claimId + (reason != null ? ". Reason: " + reason : ""));

        return mapToResponse(updatedClaim);
    }

    private ClaimResponse mapToResponse(Claim claim) {
        PolicySubscription sub = claim.getPolicySubscription();
        return ClaimResponse.builder()
                .claimId(claim.getClaimId())
                .claimType(claim.getClaimType())
                .claimDate(claim.getClaimDate())
                .claimAmount(claim.getClaimAmount())
                .status(claim.getStatus())
                .subscriptionId(sub.getSubscriptionId())
                .subscriptionNumber(sub.getSubscriptionNumber())
                .policyName(sub.getPolicyApplication().getPolicy().getPolicyName())
                .applicationId(sub.getPolicyApplication().getApplicationId())
                .userId(claim.getUser().getUserId())
                .policyNumber(sub.getSubscriptionNumber())
                .approvalDate(claim.getApprovalDate())
                .payoutDate(claim.getPayoutDate())
                .rejectionReason(claim.getRejectionReason())
                .reason(claim.getRejectionReason())
                .build();
    }
}
