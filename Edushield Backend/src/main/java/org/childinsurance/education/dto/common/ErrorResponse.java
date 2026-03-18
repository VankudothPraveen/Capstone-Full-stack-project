package org.childinsurance.education.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Error response wrapper for exception handling
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
    private LocalDateTime timestamp;

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

