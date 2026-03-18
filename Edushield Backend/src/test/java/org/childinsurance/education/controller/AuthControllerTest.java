package org.childinsurance.education.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.LoginRequest;
import org.childinsurance.education.dto.auth.RegisterRequest;
import org.childinsurance.education.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AuthController
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security for unit tests
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        // Setup test data
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("Password123")
                .phone("9876543210")
                .role("USER")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("Password123")
                .build();

        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .userId(1L)
                .name("John Doe")
                .email("john@example.com")
                .role("ROLE_USER")
                .build();

        authResponse = AuthResponse.builder()
                .success(true)
                .message("Success")
                .token("eyJhbGciOiJIUzUxMiJ9.test.token")
                .tokenType("Bearer")
                .user(userInfo)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register - Success")
    void testRegister_Success() throws Exception {
        // Given
        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.user.email").value("john@example.com"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validation Error (Empty Name)")
    void testRegister_ValidationError_EmptyName() throws Exception {
        // Given
        registerRequest.setName("");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validation Error (Invalid Email)")
    void testRegister_ValidationError_InvalidEmail() throws Exception {
        // Given
        registerRequest.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validation Error (Short Password)")
    void testRegister_ValidationError_ShortPassword() throws Exception {
        // Given
        registerRequest.setPassword("123");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/register - Duplicate Email")
    void testRegister_DuplicateEmail() throws Exception {
        // Given
        AuthResponse errorResponse = AuthResponse.error("User already exists with this email");
        when(authService.register(any(RegisterRequest.class))).thenReturn(errorResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.success").value(false))
                .andExpect(jsonPath("$.data.message").value("User already exists with this email"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/login - Success")
    void testLogin_Success() throws Exception {
        // Given
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.user.email").value("john@example.com"));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid Credentials")
    void testLogin_InvalidCredentials() throws Exception {
        // Given
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password"));

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/login - Validation Error (Empty Email)")
    void testLogin_ValidationError_EmptyEmail() throws Exception {
        // Given
        loginRequest.setEmail("");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("POST /api/auth/login - Validation Error (Empty Password)")
    void testLogin_ValidationError_EmptyPassword() throws Exception {
        // Given
        loginRequest.setPassword("");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).login(any(LoginRequest.class));
    }
}
