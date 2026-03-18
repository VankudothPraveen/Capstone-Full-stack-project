package org.childinsurance.education.service;

import org.childinsurance.education.dto.address.AddressRequest;
import org.childinsurance.education.dto.address.AddressResponse;

/**
 * Address Service Interface
 */
public interface AddressService {
    /**
     * Add new address
     */
    AddressResponse addAddress(AddressRequest request);

    /**
     * Get address by user ID
     */
    AddressResponse getAddressByUserId(Long userId);

    /**
     * Update address
     */
    AddressResponse updateAddress(Long addressId, AddressRequest request);

    /**
     * Delete address
     */
    void deleteAddress(Long addressId);
}

