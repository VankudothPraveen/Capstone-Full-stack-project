package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.address.AddressRequest;
import org.childinsurance.education.dto.address.AddressResponse;
import org.childinsurance.education.entity.Address;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.repository.AddressRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Address Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public AddressResponse addAddress(AddressRequest request) {
        log.info("Adding/Updating address for user ID: {}", request.getUserId());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already has an address to prevent unique constraint violation
        Address address = addressRepository.findByUserUserId(request.getUserId())
                .orElse(new Address());

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);
        log.info("Address saved successfully with ID: {}", savedAddress.getAddressId());

        return mapToResponse(savedAddress);
    }

    @Override
    @Transactional(readOnly = true)
    public AddressResponse getAddressByUserId(Long userId) {
        log.info("Fetching address for user ID: {}", userId);

        return addressRepository.findByUserUserId(userId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    public AddressResponse updateAddress(Long addressId, AddressRequest request) {
        log.info("Updating address with ID: {}", addressId);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> {
                    log.error("Address not found with ID: {}", addressId);
                    return new RuntimeException("Address not found");
                });

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        Address updatedAddress = addressRepository.save(address);
        log.info("Address updated successfully");

        return mapToResponse(updatedAddress);
    }

    @Override
    public void deleteAddress(Long addressId) {
        log.info("Deleting address with ID: {}", addressId);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> {
                    log.error("Address not found with ID: {}", addressId);
                    return new ResourceNotFoundException("Address", "addressId", addressId);
                });

        addressRepository.delete(address);
        log.info("Address deleted successfully");
    }

    /**
     * Map Address entity to AddressResponse DTO
     */
    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .addressId(address.getAddressId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .userId(address.getUser().getUserId())
                .build();
    }
}

