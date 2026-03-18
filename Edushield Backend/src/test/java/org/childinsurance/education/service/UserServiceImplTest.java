package org.childinsurance.education.service;

import org.childinsurance.education.dto.user.UpdateUserRequest;
import org.childinsurance.education.dto.user.UserResponse;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.exception.ResourceNotFoundException;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserServiceImpl
 */
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private Role userRole;
    private UpdateUserRequest updateUserRequest;

    @BeforeEach
    void setUp() {
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

        updateUserRequest = UpdateUserRequest.builder()
                .name("John Updated")
                .email("john.updated@example.com")
                .phone("9999999999")
                .build();
    }

    @Test
    @DisplayName("Get All Users - Success")
    void testGetAllUsers_Success() {
        // Given
        User user2 = User.builder()
                .userId(2L)
                .name("Jane Doe")
                .email("jane@example.com")
                .password("$2a$10$encodedPassword")
                .phone("9876543211")
                .role(userRole)
                .createdAt(LocalDateTime.now())
                .build();

        List<User> users = Arrays.asList(user, user2);
        Page<User> userPage = new PageImpl<>(users, PageRequest.of(0, 10), users.size());

        when(userRepository.findAll(any(Pageable.class))).thenReturn(userPage);

        // When
        Page<UserResponse> result = userService.getAllUsers(PageRequest.of(0, 10));

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getEmail()).isEqualTo("john@example.com");
        assertThat(result.getContent().get(1).getEmail()).isEqualTo("jane@example.com");

        verify(userRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Get User By ID - Success")
    void testGetUserById_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        UserResponse result = userService.getUserById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("john@example.com");
        assertThat(result.getName()).isEqualTo("John Doe");

        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Get User By ID - Not Found")
    void testGetUserById_NotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");

        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Get Current User Profile - Success")
    void testGetCurrentUserProfile_Success() {
        // Given
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserId).thenReturn(1L);
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));

            // When
            UserResponse result = userService.getCurrentUserProfile();

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getUserId()).isEqualTo(1L);
            assertThat(result.getEmail()).isEqualTo("john@example.com");

            verify(userRepository, times(1)).findById(1L);
        }
    }

    @Test
    @DisplayName("Update Current User Profile - Success")
    void testUpdateCurrentUserProfile_Success() {
        // Given
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserId).thenReturn(1L);
            
            User updatedUser = User.builder()
                    .userId(1L)
                    .name("John Updated")
                    .email("john.updated@example.com")
                    .password("$2a$10$encodedPassword")
                    .phone("9999999999")
                    .role(userRole)
                    .createdAt(LocalDateTime.now())
                    .build();

            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(updatedUser);

            // When
            UserResponse result = userService.updateCurrentUserProfile(updateUserRequest);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("John Updated");
            assertThat(result.getEmail()).isEqualTo("john.updated@example.com");
            assertThat(result.getPhone()).isEqualTo("9999999999");

            verify(userRepository, times(1)).findById(1L);
            verify(userRepository, times(1)).existsByEmail("john.updated@example.com");
            verify(userRepository, times(1)).save(any(User.class));
        }
    }

    @Test
    @DisplayName("Update Current User Profile - Email Already Exists")
    void testUpdateCurrentUserProfile_EmailAlreadyExists() {
        // Given
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserId).thenReturn(1L);
            
            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.existsByEmail("john.updated@example.com")).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> userService.updateCurrentUserProfile(updateUserRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Email already exists");

            verify(userRepository, times(1)).findById(1L);
            verify(userRepository, times(1)).existsByEmail("john.updated@example.com");
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Test
    @DisplayName("Update Current User Profile - User Not Found")
    void testUpdateCurrentUserProfile_UserNotFound() {
        // Given
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserId).thenReturn(999L);
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.updateCurrentUserProfile(updateUserRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, times(1)).findById(999L);
            verify(userRepository, never()).save(any(User.class));
        }
    }

    @Test
    @DisplayName("Delete User - Success")
    void testDeleteUser_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(any(User.class));

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    @DisplayName("Delete User - User Not Found")
    void testDeleteUser_UserNotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.deleteUser(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    @DisplayName("Update User Profile - Partial Update (Name Only)")
    void testUpdateCurrentUserProfile_PartialUpdate_NameOnly() {
        // Given
        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserId).thenReturn(1L);
            
            UpdateUserRequest partialRequest = UpdateUserRequest.builder()
                    .name("John Updated Only")
                    .build();

            User updatedUser = User.builder()
                    .userId(1L)
                    .name("John Updated Only")
                    .email("john@example.com")
                    .password("$2a$10$encodedPassword")
                    .phone("9876543210")
                    .role(userRole)
                    .createdAt(LocalDateTime.now())
                    .build();

            when(userRepository.findById(1L)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(updatedUser);

            // When
            UserResponse result = userService.updateCurrentUserProfile(partialRequest);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo("John Updated Only");
            assertThat(result.getEmail()).isEqualTo("john@example.com"); // Unchanged
            assertThat(result.getPhone()).isEqualTo("9876543210"); // Unchanged

            verify(userRepository, times(1)).save(any(User.class));
        }
    }
}
