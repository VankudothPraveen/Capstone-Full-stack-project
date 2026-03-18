package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.benefit.BenefitCalculationResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.service.BenefitCalculationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Benefit Calculation Controller
 * Base URL: /api/benefit-calculations
 */
@RestController
@RequestMapping("/api/benefit-calculations")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class BenefitCalculationController {

    private final BenefitCalculationService benefitCalculationService;

    /**
     * GET /api/benefit-calculations/my
     * Get benefit calculations for the currently logged-in user
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyCalculations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BenefitCalculationResponse> calculations = benefitCalculationService.getMyCalculations(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Benefit calculations retrieved successfully",
                calculations.getContent(),
                calculations.getNumber(),
                calculations.getSize(),
                calculations.getTotalElements(),
                calculations.getTotalPages()
        ));
    }

    /**
     * GET /api/benefit-calculations/{id}
     * Get benefit calculation by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getCalculationById(@PathVariable Long id) {
        BenefitCalculationResponse response = benefitCalculationService.getCalculationById(id);
        return ResponseEntity.ok(ApiResponse.success("Benefit calculation retrieved successfully", response));
    }

    /**
     * GET /api/benefit-calculations/subscription/{subscriptionId}
     * Get benefit calculations for a subscription
     */
    @GetMapping("/subscription/{subscriptionId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getCalculationsBySubscription(@PathVariable Long subscriptionId) {
        List<BenefitCalculationResponse> responses = benefitCalculationService.getCalculationsBySubscriptionId(subscriptionId);
        return ResponseEntity.ok(ApiResponse.success("Benefit calculations retrieved successfully", responses));
    }

    /**
     * POST /api/benefit-calculations/calculate
     * Trigger a new benefit calculation
     */
    @PostMapping("/calculate")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> calculate(@RequestBody Map<String, Object> request) {
        Long subscriptionId = Long.valueOf(request.get("subscriptionId").toString());
        String benefitType = (String) request.get("benefitType");
        BenefitCalculationResponse response = benefitCalculationService.calculate(subscriptionId, benefitType);
        return ResponseEntity.ok(ApiResponse.success("Benefit calculated successfully", response));
    }
}
