package org.childinsurance.education.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String role;
    @com.fasterxml.jackson.annotation.JsonProperty("isActive")
    private boolean isActive;
    private LocalDateTime createdAt;
}

