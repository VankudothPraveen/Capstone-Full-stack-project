package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.address.AddressRequest;
import org.childinsurance.education.dto.address.AddressResponse;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.security.SecurityUtils;
import org.childinsurance.education.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Address Controller for address management
 * Base URL: /api/addresses
 */
@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * POST /api/addresses
     * Add address
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> addAddress(@Valid @RequestBody AddressRequest request) {
        request.setUserId(SecurityUtils.getCurrentUserId());
        AddressResponse response = addressService.addAddress(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address added successfully", response));
    }

    /**
     * GET /api/addresses/my
     * Get address for the currently logged-in user
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getMyAddress() {
        Long userId = SecurityUtils.getCurrentUserId();
        AddressResponse response = addressService.getAddressByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Address retrieved successfully", response));
    }

    /**
     * GET /api/addresses/user/{userId}
     * Get address by user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getAddressByUser(@PathVariable Long userId) {
        AddressResponse response = addressService.getAddressByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Address retrieved successfully", response));
    }

    /**
     * PUT /api/addresses/{addressId}
     * Update address
     */
    @PutMapping("/{addressId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse response = addressService.updateAddress(addressId, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", response));
    }

    /**
     * DELETE /api/addresses/{addressId}
     * Delete address
     */
    @DeleteMapping("/{addressId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }
}
