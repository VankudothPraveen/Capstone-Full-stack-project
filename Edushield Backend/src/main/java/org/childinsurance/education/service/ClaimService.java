package org.childinsurance.education.service;

import org.childinsurance.education.dto.claim.ClaimRequest;
import org.childinsurance.education.dto.claim.ClaimResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Claim Service Interface
 */
public interface ClaimService {
    /**
     * Raise/submit a claim
     */
    ClaimResponse raiseClaim(ClaimRequest request);

    /**
     * Get all claims of logged-in user
     */
    Page<ClaimResponse> getMyClaims(Pageable pageable);

    /**
     * Get all claims (Admin)
     */
    Page<ClaimResponse> getAllClaims(Pageable pageable);

    /**
     * Get claim details by ID
     */
    ClaimResponse getClaimById(Long claimId);

    /**
     * Approve claim (Admin/Claims Officer)
     */
    ClaimResponse approveClaim(Long claimId, java.math.BigDecimal revisedAmount);

    /**
     * Reject claim (Admin)
     */
    ClaimResponse rejectClaim(Long claimId, String reason);
}
