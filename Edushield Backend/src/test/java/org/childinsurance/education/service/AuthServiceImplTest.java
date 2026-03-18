package org.childinsurance.education.service;

import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.LoginRequest;
import org.childinsurance.education.dto.auth.RegisterRequest;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.RoleRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.CustomUserDetails;
import org.childinsurance.education.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthServiceImpl
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private Role userRole;
    private User user;

    @BeforeEach
    void setUp() {
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

        userRole = new Role();
        userRole.setRoleId(2L);
        userRole.setRoleName("USER");

        user = User.builder()
                .userId(1L)
                .name("John Doe")
                .email("john@example.com")
                .password("$2a$10$encodedPassword")
                .phone("9876543210")
                .role(userRole)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Register - Success")
    void testRegister_Success() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByRoleName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtTokenProvider.generateTokenFromUser(any(CustomUserDetails.class)))
                .thenReturn("eyJhbGciOiJIUzUxMiJ9.test.token");

        // When
        AuthResponse response = authService.register(registerRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getToken()).isNotNull();
        assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");
        assertThat(response.getUser().getRole()).isEqualTo("USER");

        verify(userRepository, times(1)).existsByEmail("john@example.com");
        verify(roleRepository, times(1)).findByRoleName("USER");
        verify(passwordEncoder, times(1)).encode("Password123");
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtTokenProvider, times(1)).generateTokenFromUser(any(CustomUserDetails.class));
    }

    @Test
    @DisplayName("Register - User Already Exists")
    void testRegister_UserAlreadyExists() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When
        AuthResponse response = authService.register(registerRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getMessage()).isEqualTo("User already exists with this email");

        verify(userRepository, times(1)).existsByEmail("john@example.com");
        verify(roleRepository, never()).findByRoleName(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Register - Role Not Found")
    void testRegister_RoleNotFound() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByRoleName("USER")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Role not found");

        verify(userRepository, times(1)).existsByEmail("john@example.com");
        verify(roleRepository, times(1)).findByRoleName("USER");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login - Success")
    void testLogin_Success() {
        // Given
        CustomUserDetails userDetails = CustomUserDetails.builder()
                .userId(1L)
                .email("john@example.com")
                .name("John Doe")
                .role("USER")
                .password("$2a$10$encodedPassword")
                .enabled(true)
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(any(Authentication.class)))
                .thenReturn("eyJhbGciOiJIUzUxMiJ9.test.token");

        // When
        AuthResponse response = authService.login(loginRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getToken()).isNotNull();
        assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");

        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, times(1)).generateToken(any(Authentication.class));
    }

    @Test
    @DisplayName("Login - Invalid Credentials")
    void testLogin_InvalidCredentials() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid email or password");

        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, never()).generateToken(any(Authentication.class));
    }

    @Test
    @DisplayName("Login - Authentication Exception")
    void testLogin_AuthenticationException() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Authentication failed"));

        // When & Then
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid email or password");

        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
