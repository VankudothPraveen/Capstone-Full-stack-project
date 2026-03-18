package org.childinsurance.education.service;

import org.childinsurance.education.dto.address.AddressRequest;
import org.childinsurance.education.dto.address.AddressResponse;
import org.childinsurance.education.entity.Address;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.repository.AddressRepository;
import org.childinsurance.education.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AddressServiceImpl
 */
@ExtendWith(MockitoExtension.class)
class AddressServiceImplTest {

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AddressServiceImpl addressService;

    private User user;
    private Address address;
    private AddressRequest addressRequest;
    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setRoleId(2L);
        userRole.setRoleName("USER");

        user = User.builder()
                .userId(1L)
                .name("John Doe")
                .email("john@example.com")
                .phone("9876543210")
                .role(userRole)
                .build();

        address = Address.builder()
                .addressId(1L)
                .street("123 Main Street")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .user(user)
                .build();

        addressRequest = AddressRequest.builder()
                .street("123 Main Street")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .userId(1L)
                .build();
    }

    @Test
    @DisplayName("Add Address - Success")
    void testAddAddress_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.save(any(Address.class))).thenReturn(address);

        // When
        AddressResponse response = addressService.addAddress(addressRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAddressId()).isEqualTo(1L);
        assertThat(response.getStreet()).isEqualTo("123 Main Street");
        assertThat(response.getCity()).isEqualTo("Mumbai");
        assertThat(response.getState()).isEqualTo("Maharashtra");
        assertThat(response.getPincode()).isEqualTo("400001");
        assertThat(response.getUserId()).isEqualTo(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    @DisplayName("Add Address - User Not Found")
    void testAddAddress_UserNotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        addressRequest.setUserId(999L);

        // When & Then
        assertThatThrownBy(() -> addressService.addAddress(addressRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");

        verify(userRepository, times(1)).findById(999L);
        verify(addressRepository, never()).save(any(Address.class));
    }

    @Test
    @DisplayName("Get Address By User ID - Success")
    void testGetAddressByUserId_Success() {
        // Given
        when(addressRepository.findByUserUserId(1L)).thenReturn(Optional.of(address));

        // When
        AddressResponse response = addressService.getAddressByUserId(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAddressId()).isEqualTo(1L);
        assertThat(response.getStreet()).isEqualTo("123 Main Street");
        assertThat(response.getCity()).isEqualTo("Mumbai");
        assertThat(response.getState()).isEqualTo("Maharashtra");
        assertThat(response.getPincode()).isEqualTo("400001");
        assertThat(response.getUserId()).isEqualTo(1L);

        verify(addressRepository, times(1)).findByUserUserId(1L);
    }

    @Test
    @DisplayName("Get Address By User ID - Not Found")
    void testGetAddressByUserId_NotFound() {
        // Given
        when(addressRepository.findByUserUserId(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> addressService.getAddressByUserId(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Address not found");

        verify(addressRepository, times(1)).findByUserUserId(999L);
    }

    @Test
    @DisplayName("Update Address - Success")
    void testUpdateAddress_Success() {
        // Given
        AddressRequest updateRequest = AddressRequest.builder()
                .street("456 New Street")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .build();

        Address updatedAddress = Address.builder()
                .addressId(1L)
                .street("456 New Street")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .user(user)
                .build();

        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(addressRepository.save(any(Address.class))).thenReturn(updatedAddress);

        // When
        AddressResponse response = addressService.updateAddress(1L, updateRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAddressId()).isEqualTo(1L);
        assertThat(response.getStreet()).isEqualTo("456 New Street");
        assertThat(response.getCity()).isEqualTo("Delhi");
        assertThat(response.getState()).isEqualTo("Delhi");
        assertThat(response.getPincode()).isEqualTo("110001");

        verify(addressRepository, times(1)).findById(1L);
        verify(addressRepository, times(1)).save(any(Address.class));
    }

    @Test
    @DisplayName("Update Address - Not Found")
    void testUpdateAddress_NotFound() {
        // Given
        when(addressRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> addressService.updateAddress(999L, addressRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Address not found");

        verify(addressRepository, times(1)).findById(999L);
        verify(addressRepository, never()).save(any(Address.class));
    }

    @Test
    @DisplayName("Delete Address - Success")
    void testDeleteAddress_Success() {
        // Given
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        doNothing().when(addressRepository).delete(address);

        // When
        addressService.deleteAddress(1L);

        // Then
        verify(addressRepository, times(1)).findById(1L);
        verify(addressRepository, times(1)).delete(address);
    }

    @Test
    @DisplayName("Delete Address - Not Found")
    void testDeleteAddress_NotFound() {
        // Given
        when(addressRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> addressService.deleteAddress(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Address not found");

        verify(addressRepository, times(1)).findById(999L);
        verify(addressRepository, never()).delete(any(Address.class));
    }

    @Test
    @DisplayName("Add Address - Verify All Fields Mapped Correctly")
    void testAddAddress_FieldMapping() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> {
            Address savedAddr = invocation.getArgument(0);
            savedAddr.setAddressId(1L);
            return savedAddr;
        });

        // When
        AddressResponse response = addressService.addAddress(addressRequest);

        // Then
        assertThat(response.getStreet()).isEqualTo(addressRequest.getStreet());
        assertThat(response.getCity()).isEqualTo(addressRequest.getCity());
        assertThat(response.getState()).isEqualTo(addressRequest.getState());
        assertThat(response.getPincode()).isEqualTo(addressRequest.getPincode());
        assertThat(response.getUserId()).isEqualTo(addressRequest.getUserId());
    }

    @Test
    @DisplayName("Update Address - Partial Update")
    void testUpdateAddress_PartialUpdate() {
        // Given
        AddressRequest partialUpdate = AddressRequest.builder()
                .street("789 Updated Street")
                .city("Bangalore")
                .state("Karnataka")
                .pincode("560001")
                .build();

        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));
        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        AddressResponse response = addressService.updateAddress(1L, partialUpdate);

        // Then
        assertThat(response).isNotNull();
        verify(addressRepository, times(1)).findById(1L);
        verify(addressRepository, times(1)).save(any(Address.class));
    }
}
