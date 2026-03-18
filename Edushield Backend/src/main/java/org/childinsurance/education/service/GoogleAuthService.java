package org.childinsurance.education.service;

import org.childinsurance.education.dto.auth.AuthResponse;
import org.childinsurance.education.dto.auth.GoogleLoginRequest;

public interface GoogleAuthService {
    AuthResponse loginWithGoogle(GoogleLoginRequest request);
}
