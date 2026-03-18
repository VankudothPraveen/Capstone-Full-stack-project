package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.entity.AuditLog;
import org.childinsurance.education.repository.AuditLogRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Reusable Audit Logging Service.
 * Automatically captures current user context when available.
 * Runs asynchronously so it never blocks business logic.
 */
@Service
@AllArgsConstructor
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Full-parameter log method for cases where user info is explicitly provided.
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(Long userId, String userEmail, String role, String action,
                          String entityType, Long entityId, String description) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .role(role)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .description(description)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(auditLog);
            log.debug("Audit log created: {} - {} - {} - {}", userEmail, action, entityType, entityId);
        } catch (Exception e) {
            // Audit logging should never break business flow
            log.error("Failed to create audit log: {}", e.getMessage());
        }
    }

    /**
     * Convenience method that auto-extracts current user from SecurityContext.
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(String action, String entityType, Long entityId, String description) {
        try {
            Long userId = SecurityUtils.getCurrentUserId();
            String userEmail = SecurityUtils.getCurrentUserEmail();
            String role = SecurityUtils.getCurrentUserRole();

            logAction(userId, userEmail, role, action, entityType, entityId, description);
        } catch (Exception e) {
            log.error("Failed to create audit log (auto-context): {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getAllLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByUser(Long userId, Pageable pageable) {
        return auditLogRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByAction(String action, Pageable pageable) {
        return auditLogRepository.findByAction(action, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByEmail(String email, Pageable pageable) {
        return auditLogRepository.findByUserEmailContainingIgnoreCase(email, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsFiltered(String action, String email,
                                           LocalDateTime startDate, LocalDateTime endDate,
                                           Pageable pageable) {
        return auditLogRepository.findWithFilters(action, email, startDate, endDate, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getDistinctActions() {
        return auditLogRepository.findDistinctActions();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAllLogsForExport() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
