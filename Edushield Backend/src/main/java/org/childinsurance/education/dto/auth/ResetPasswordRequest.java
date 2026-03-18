package org.childinsurance.education.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Token/OTP is required")
    private String token;

    @NotBlank(message = "New password is required")
    private String newPassword;
}
