package org.childinsurance.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.childinsurance.education.dto.user.UpdateUserRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for UserController
 */
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security for unit tests
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private UserResponse userResponse;
    private UpdateUserRequest updateUserRequest;

    @BeforeEach
    void setUp() {
        userResponse = UserResponse.builder()
                .userId(1L)
                .name("John Doe")
                .email("john@example.com")
                .phone("9876543210")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .build();

        updateUserRequest = UpdateUserRequest.builder()
                .name("John Updated")
                .email("john.updated@example.com")
                .phone("9999999999")
                .build();
    }

    @Test
    @DisplayName("GET /api/users/me - Success")
    void testGetLoggedInUserProfile_Success() throws Exception {
        // Given
        when(userService.getCurrentUserProfile()).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User profile retrieved successfully"))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.email").value("john@example.com"));

        verify(userService, times(1)).getCurrentUserProfile();
    }

    @Test
    @DisplayName("PUT /api/users/me - Success")
    void testUpdateLoggedInUserProfile_Success() throws Exception {
        // Given
        UserResponse updatedResponse = UserResponse.builder()
                .userId(1L)
                .name("John Updated")
                .email("john.updated@example.com")
                .phone("9999999999")
                .role("ROLE_USER")
                .createdAt(LocalDateTime.now())
                .build();

        when(userService.updateCurrentUserProfile(any(UpdateUserRequest.class)))
                .thenReturn(updatedResponse);

        // When & Then
        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User profile updated successfully"))
                .andExpect(jsonPath("$.data.name").value("John Updated"))
                .andExpect(jsonPath("$.data.email").value("john.updated@example.com"));

        verify(userService, times(1)).updateCurrentUserProfile(any(UpdateUserRequest.class));
    }

    @Test
    @DisplayName("GET /api/users - Success (Admin)")
    void testGetAllUsers_Success() throws Exception {
        // Given
        List<UserResponse> users = Arrays.asList(
                userResponse,
                UserResponse.builder()
                        .userId(2L)
                        .name("Jane Doe")
                        .email("jane@example.com")
                        .phone("9876543211")
                        .role("ROLE_USER")
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        Page<UserResponse> userPage = new PageImpl<>(users, PageRequest.of(0, 10), users.size());
        when(userService.getAllUsers(any())).thenReturn(userPage);

        // When & Then
        mockMvc.perform(get("/api/users")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Users retrieved successfully"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));

        verify(userService, times(1)).getAllUsers(any());
    }

    @Test
    @DisplayName("GET /api/users/{userId} - Success (Admin)")
    void testGetUserById_Success() throws Exception {
        // Given
        when(userService.getUserById(1L)).thenReturn(userResponse);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User retrieved successfully"))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.email").value("john@example.com"));

        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    @DisplayName("GET /api/users/{userId} - User Not Found")
    void testGetUserById_NotFound() throws Exception {
        // Given
        when(userService.getUserById(999L))
                .thenThrow(new ResourceNotFoundException("User", "id", 999L));

        // When & Then
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).getUserById(999L);
    }

    @Test
    @DisplayName("DELETE /api/users/{userId} - Success (Admin)")
    void testDeleteUser_Success() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(1L);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User deleted successfully"));

        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    @DisplayName("DELETE /api/users/{userId} - User Not Found")
    void testDeleteUser_NotFound() throws Exception {
        // Given
        doThrow(new ResourceNotFoundException("User", "id", 999L))
                .when(userService).deleteUser(999L);

        // When & Then
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isNotFound());

        verify(userService, times(1)).deleteUser(999L);
    }
}
