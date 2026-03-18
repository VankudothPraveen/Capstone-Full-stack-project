package org.childinsurance.education.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Token Provider for generating and validating JWT tokens
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret:MjRhNDI1NmI3ODljZDRlNWYzYjEwN2EyZDMwZWY4NjU5ZjcwYTFiYzc4OTBkZTQxNTQ3ZWY5MzJhODE3YzkyNQ==}")
    private String jwtSecret;

    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    /**
     * Get the signing key
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT token from Authentication
     */
    public String generateToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        return generateTokenFromUser(userPrincipal);
    }

    /**
     * Generate JWT token from user details using JJWT 0.12.3 API
     */
    public String generateTokenFromUser(CustomUserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(userDetails.getEmail())
                .claim(JwtConstants.JWT_CLAIM_USER_ID, userDetails.getUserId())
                .claim(JwtConstants.JWT_CLAIM_EMAIL, userDetails.getEmail())
                .claim(JwtConstants.JWT_CLAIM_ROLE, userDetails.getRole())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    /**
     * Get user email from JWT token using JJWT 0.12.3 API
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    /**
     * Get user ID from JWT token using JJWT 0.12.3 API
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get(JwtConstants.JWT_CLAIM_USER_ID, Long.class);
    }

    /**
     * Get user role from JWT token using JJWT 0.12.3 API
     */
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get(JwtConstants.JWT_CLAIM_ROLE, String.class);
    }

    /**
     * Validate JWT token using JJWT 0.12.3 API
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Get expiration time from token using JJWT 0.12.3 API
     */
    public long getExpirationTimeFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration().getTime();
    }
}





