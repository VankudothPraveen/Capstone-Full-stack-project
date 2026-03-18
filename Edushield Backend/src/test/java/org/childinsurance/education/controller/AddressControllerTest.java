package org.childinsurance.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.childinsurance.education.dto.address.AddressRequest;
import org.childinsurance.education.dto.address.AddressResponse;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.security.SecurityUtils;
import org.childinsurance.education.service.AddressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AddressController
 */
@WebMvcTest(AddressController.class)
@AutoConfigureMockMvc(addFilters = false)
class AddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AddressService addressService;

    private AddressRequest addressRequest;
    private AddressResponse addressResponse;

    @BeforeEach
    void setUp() {
        addressRequest = AddressRequest.builder()
                .street("123 Main Street")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .userId(1L)
                .build();

        addressResponse = AddressResponse.builder()
                .addressId(1L)
                .street("123 Main Street")
                .city("Mumbai")
                .state("Maharashtra")
                .pincode("400001")
                .userId(1L)
                .build();
    }

    @Test
    @DisplayName("POST /api/addresses - Success")
    void testAddAddress_Success() throws Exception {
        // Given
        when(addressService.addAddress(any(AddressRequest.class))).thenReturn(addressResponse);

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Address added successfully"))
                .andExpect(jsonPath("$.data.addressId").value(1))
                .andExpect(jsonPath("$.data.street").value("123 Main Street"))
                .andExpect(jsonPath("$.data.city").value("Mumbai"))
                .andExpect(jsonPath("$.data.state").value("Maharashtra"))
                .andExpect(jsonPath("$.data.pincode").value("400001"))
                .andExpect(jsonPath("$.data.userId").value(1));

        verify(addressService, times(1)).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Empty Street)")
    void testAddAddress_ValidationError_EmptyStreet() throws Exception {
        // Given
        addressRequest.setStreet("");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Short Street)")
    void testAddAddress_ValidationError_ShortStreet() throws Exception {
        // Given
        addressRequest.setStreet("123");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Empty City)")
    void testAddAddress_ValidationError_EmptyCity() throws Exception {
        // Given
        addressRequest.setCity("");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Empty State)")
    void testAddAddress_ValidationError_EmptyState() throws Exception {
        // Given
        addressRequest.setState("");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Empty Pincode)")
    void testAddAddress_ValidationError_EmptyPincode() throws Exception {
        // Given
        addressRequest.setPincode("");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("POST /api/addresses - Validation Error (Short Pincode)")
    void testAddAddress_ValidationError_ShortPincode() throws Exception {
        // Given
        addressRequest.setPincode("123");

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).addAddress(any(AddressRequest.class));
    }

    @Test
    @DisplayName("GET /api/addresses/my - Success")
    void testGetMyAddress_Success() throws Exception {
        // Given
        when(addressService.getAddressByUserId(1L)).thenReturn(addressResponse);

        // When & Then
        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserId).thenReturn(1L);

            mockMvc.perform(get("/api/addresses/my"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.message").value("Address retrieved successfully"))
                    .andExpect(jsonPath("$.data.addressId").value(1))
                    .andExpect(jsonPath("$.data.street").value("123 Main Street"))
                    .andExpect(jsonPath("$.data.city").value("Mumbai"));

            verify(addressService, times(1)).getAddressByUserId(1L);
        }
    }

    @Test
    @DisplayName("GET /api/addresses/user/{userId} - Success")
    void testGetAddressByUser_Success() throws Exception {
        // Given
        when(addressService.getAddressByUserId(1L)).thenReturn(addressResponse);

        // When & Then
        mockMvc.perform(get("/api/addresses/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Address retrieved successfully"))
                .andExpect(jsonPath("$.data.addressId").value(1))
                .andExpect(jsonPath("$.data.street").value("123 Main Street"))
                .andExpect(jsonPath("$.data.city").value("Mumbai"))
                .andExpect(jsonPath("$.data.state").value("Maharashtra"))
                .andExpect(jsonPath("$.data.pincode").value("400001"));

        verify(addressService, times(1)).getAddressByUserId(1L);
    }

    @Test
    @DisplayName("GET /api/addresses/user/{userId} - Not Found")
    void testGetAddressByUser_NotFound() throws Exception {
        // Given
        when(addressService.getAddressByUserId(999L))
                .thenThrow(new RuntimeException("Address not found"));

        // When & Then
        mockMvc.perform(get("/api/addresses/user/999"))
                .andExpect(status().isInternalServerError());

        verify(addressService, times(1)).getAddressByUserId(999L);
    }

    @Test
    @DisplayName("PUT /api/addresses/{addressId} - Success")
    void testUpdateAddress_Success() throws Exception {
        // Given
        AddressRequest updateRequest = AddressRequest.builder()
                .street("456 New Street")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .build();

        AddressResponse updatedResponse = AddressResponse.builder()
                .addressId(1L)
                .street("456 New Street")
                .city("Delhi")
                .state("Delhi")
                .pincode("110001")
                .userId(1L)
                .build();

        when(addressService.updateAddress(eq(1L), any(AddressRequest.class))).thenReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/addresses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Address updated successfully"))
                .andExpect(jsonPath("$.data.addressId").value(1))
                .andExpect(jsonPath("$.data.street").value("456 New Street"))
                .andExpect(jsonPath("$.data.city").value("Delhi"))
                .andExpect(jsonPath("$.data.state").value("Delhi"))
                .andExpect(jsonPath("$.data.pincode").value("110001"));

        verify(addressService, times(1)).updateAddress(eq(1L), any(AddressRequest.class));
    }

    @Test
    @DisplayName("PUT /api/addresses/{addressId} - Validation Error")
    void testUpdateAddress_ValidationError() throws Exception {
        // Given
        addressRequest.setStreet("");

        // When & Then
        mockMvc.perform(put("/api/addresses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isBadRequest());

        verify(addressService, never()).updateAddress(eq(1L), any(AddressRequest.class));
    }

    @Test
    @DisplayName("PUT /api/addresses/{addressId} - Not Found")
    void testUpdateAddress_NotFound() throws Exception {
        // Given
        when(addressService.updateAddress(eq(999L), any(AddressRequest.class)))
                .thenThrow(new RuntimeException("Address not found"));

        // When & Then
        mockMvc.perform(put("/api/addresses/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isInternalServerError());

        verify(addressService, times(1)).updateAddress(eq(999L), any(AddressRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/addresses/{addressId} - Success")
    void testDeleteAddress_Success() throws Exception {
        // Given
        doNothing().when(addressService).deleteAddress(1L);

        // When & Then
        mockMvc.perform(delete("/api/addresses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Address deleted successfully"))
                .andExpect(jsonPath("$.data").isEmpty());

        verify(addressService, times(1)).deleteAddress(1L);
    }

    @Test
    @DisplayName("DELETE /api/addresses/{addressId} - Not Found")
    void testDeleteAddress_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("Address", "addressId", 999L))
                .when(addressService).deleteAddress(999L);

        // When & Then
        mockMvc.perform(delete("/api/addresses/999"))
                .andExpect(status().isNotFound());

        verify(addressService, times(1)).deleteAddress(999L);
    }

    @Test
    @DisplayName("POST /api/addresses - User Not Found")
    void testAddAddress_UserNotFound() throws Exception {
        // Given
        when(addressService.addAddress(any(AddressRequest.class)))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(post("/api/addresses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addressRequest)))
                .andExpect(status().isInternalServerError());

        verify(addressService, times(1)).addAddress(any(AddressRequest.class));
    }
}
