package org.childinsurance.education.service;

import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.ForgotPasswordRequest;
import org.childinsurance.education.dto.auth.LoginRequest;
import org.childinsurance.education.dto.auth.RegisterRequest;
import org.childinsurance.education.dto.auth.ResetPasswordRequest;

/**
 * Authentication Service Interface
 */
public interface AuthService {
    /**
     * Register a new user
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Login user and generate JWT token
     */
    AuthResponse login(LoginRequest request);

    /**
     * Initiate password reset
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Complete password reset
     */
    void resetPassword(ResetPasswordRequest request);
}

