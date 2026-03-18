package org.childinsurance.education.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Pagination response wrapper for list endpoints
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginationResponse<T> {
    private boolean success;
    private String message;
    private List<T> data;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean isFirst;
    private boolean isLast;
    private LocalDateTime timestamp;

    public static <T> PaginationResponse<T> success(String message, List<T> data, int pageNumber,
                                                     int pageSize, long totalElements, int totalPages) {
        return PaginationResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .isFirst(pageNumber == 0)
                .isLast(pageNumber >= totalPages - 1)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

