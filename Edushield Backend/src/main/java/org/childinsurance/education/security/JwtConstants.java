package org.childinsurance.education.security;

/**
 * JWT constants used throughout the application
 */
public class JwtConstants {
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_PREFIX = "Bearer ";
    public static final String JWT_SECRET = "${app.jwt.secret}";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds
    public static final String JWT_CLAIM_USER_ID = "userId";
    public static final String JWT_CLAIM_EMAIL = "email";
    public static final String JWT_CLAIM_ROLE = "role";
}

