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
 * Admin Claim Controller
 * Base URL: /api/admin/claims
 */
@RestController
@RequestMapping("/api/admin/claims")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class AdminClaimController {

    private final ClaimService claimService;

    /**
     * GET /api/admin/claims
     * Get all claims
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
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

    @PutMapping("/{claimId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> approveClaim(
            @PathVariable Long claimId,
            @RequestParam(required = false) java.math.BigDecimal revisedAmount) {
        ClaimResponse response = claimService.approveClaim(claimId, revisedAmount);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", response));
    }

    @PutMapping("/{claimId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> rejectClaim(
            @PathVariable Long claimId,
            @RequestParam(required = false) String rejectionReason,
            @RequestParam(required = false) String reason) {
        String r = rejectionReason != null ? rejectionReason : reason;
        ClaimResponse response = claimService.rejectClaim(claimId, r);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected successfully", response));
    }
}
