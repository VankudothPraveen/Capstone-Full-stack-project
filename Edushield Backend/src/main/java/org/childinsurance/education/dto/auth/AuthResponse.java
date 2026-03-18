package org.childinsurance.education.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for authentication response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private String tokenType;
    private UserInfo user;
    private LocalDateTime timestamp;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private Long userId;
        private String name;
        private String email;
        private String role;
        private String provider;
    }

    public static AuthResponse success(String message, String token, UserInfo user) {
        return AuthResponse.builder()
                .success(true)
                .message(message)
                .token(token)
                .tokenType("Bearer")
                .user(user)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

