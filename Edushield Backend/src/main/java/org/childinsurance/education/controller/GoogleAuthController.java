package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.GoogleLoginRequest;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.service.GoogleAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class GoogleAuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<?>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        AuthResponse response = googleAuthService.loginWithGoogle(request);
        if (response.getToken() != null) {
            return ResponseEntity.ok(ApiResponse.success("Google login successful", response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage(), "ERROR"));
        }
    }
}
