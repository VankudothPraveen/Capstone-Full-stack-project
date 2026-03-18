package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.claim.ClaimResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.ClaimService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Claims Officer Controller for reviewing claims
 */
@RestController
@RequestMapping("/api/claims-officer/claims")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class ClaimsOfficerController {

    private final ClaimService claimService;

    @GetMapping
    @PreAuthorize("hasRole('CLAIMS_OFFICER')")
    public ResponseEntity<?> getAllClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClaimResponse> claims = claimService.getAllClaims(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "All claims retrieved successfully",
                claims.getContent(),
                claims.getNumber(),
                claims.getSize(),
                claims.getTotalElements(),
                claims.getTotalPages()));
    }

    @GetMapping("/{claimId}")
    @PreAuthorize("hasRole('CLAIMS_OFFICER')")
    public ResponseEntity<ApiResponse<?>> getClaimById(@PathVariable Long claimId) {
        ClaimResponse response = claimService.getClaimById(claimId);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", response));
    }

    @PutMapping("/{claimId}/approve")
    @PreAuthorize("hasRole('CLAIMS_OFFICER')")
    public ResponseEntity<ApiResponse<?>> approveClaim(
            @PathVariable Long claimId,
            @RequestParam(required = false) java.math.BigDecimal revisedAmount) {
        ClaimResponse response = claimService.approveClaim(claimId, revisedAmount);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", response));
    }

    @PutMapping("/{claimId}/reject")
    @PreAuthorize("hasRole('CLAIMS_OFFICER')")
    public ResponseEntity<ApiResponse<?>> rejectClaim(
            @PathVariable Long claimId,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam(required = false) String reason) {
        String r = rejectionReason != null ? rejectionReason : reason;
        ClaimResponse response = claimService.rejectClaim(claimId, r);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", response));
    }
}
