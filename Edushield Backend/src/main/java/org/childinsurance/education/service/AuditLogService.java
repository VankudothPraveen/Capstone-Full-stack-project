package org.childinsurance.education.service;

import org.childinsurance.education.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogService {

    void logAction(Long userId, String userEmail, String role, String action,
                   String entityType, Long entityId, String description);

    void logAction(String action, String entityType, Long entityId, String description);

    Page<AuditLog> getAllLogs(Pageable pageable);

    Page<AuditLog> getLogsByUser(Long userId, Pageable pageable);

    Page<AuditLog> getLogsByAction(String action, Pageable pageable);

    Page<AuditLog> getLogsByEmail(String email, Pageable pageable);

    Page<AuditLog> getLogsFiltered(String action, String email,
                                    LocalDateTime startDate, LocalDateTime endDate,
                                    Pageable pageable);

    List<String> getDistinctActions();

    List<AuditLog> getAllLogsForExport();
}
