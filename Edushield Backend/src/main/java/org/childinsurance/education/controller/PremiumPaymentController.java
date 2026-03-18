package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.dto.payment.PremiumPaymentRequest;
import org.childinsurance.education.dto.payment.PremiumPaymentResponse;
import org.childinsurance.education.service.PremiumPaymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Premium Payment Controller
 * Base URL: /api/premium-payments
 */
@RestController
@RequestMapping("/api/premium-payments")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class PremiumPaymentController {

    private final PremiumPaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> payPremium(@Valid @RequestBody PremiumPaymentRequest request) {
        PremiumPaymentResponse response = paymentService.payPremium(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Premium payment successful", response));
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getPaymentHistoryByApplication(
            @PathVariable Long applicationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PremiumPaymentResponse> payments = paymentService.getPaymentsByApplication(applicationId, pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Payment history retrieved successfully",
                payments.getContent(),
                payments.getNumber(),
                payments.getSize(),
                payments.getTotalElements(),
                payments.getTotalPages()
        ));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PremiumPaymentResponse> payments = paymentService.getMyPayments(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "User payments retrieved successfully",
                payments.getContent(),
                payments.getNumber(),
                payments.getSize(),
                payments.getTotalElements(),
                payments.getTotalPages()
        ));
    }

    /**
     * GET /api/premium-payments/{paymentId}
     * Get payment by ID
     */
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getPaymentById(@PathVariable Long paymentId) {
        PremiumPaymentResponse response = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", response));
    }
}
