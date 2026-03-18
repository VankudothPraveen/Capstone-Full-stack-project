package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.claim.ClaimRequest;
import org.childinsurance.education.dto.claim.ClaimResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.ClaimService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Claim Controller
 * Base URL: /api/claims
 */
@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    /**
     * POST /api/claims
     * Raise claim
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> raiseClaim(@Valid @RequestBody ClaimRequest request) {
        ClaimResponse response = claimService.raiseClaim(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim raised successfully", response));
    }

    /**
     * GET /api/claims/my
     * Get logged-in user claims
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClaimResponse> claims = claimService.getMyClaims(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "User claims retrieved successfully",
                claims.getContent(),
                claims.getNumber(),
                claims.getSize(),
                claims.getTotalElements(),
                claims.getTotalPages()
        ));
    }

    /**
     * GET /api/claims/{claimId}
     * Get claim details
     */
    @GetMapping("/{claimId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getClaimDetails(@PathVariable Long claimId) {
        ClaimResponse response = claimService.getClaimById(claimId);
        return ResponseEntity.ok(ApiResponse.success("Claim details retrieved successfully", response));
    }
}

