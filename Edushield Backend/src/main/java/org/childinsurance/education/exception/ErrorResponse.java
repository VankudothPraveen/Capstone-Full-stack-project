package org.childinsurance.education.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard error response for all exceptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private boolean success;
    private String message;
    private String errorCode;
    private String details;
    private String path;
    private LocalDateTime timestamp;

    /**
     * Create error response with minimal information
     */
    public static ErrorResponse error(String message, String errorCode) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Create error response with detailed information
     */
    public static ErrorResponse error(String message, String errorCode, String details) {
        return ErrorResponse.builder()
                .success(false)
                .message(message)
                .errorCode(errorCode)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

