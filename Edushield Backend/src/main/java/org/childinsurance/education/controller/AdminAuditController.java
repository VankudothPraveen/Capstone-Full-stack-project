package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.entity.AuditLog;
import org.childinsurance.education.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Audit Log Controller
 * Base URL: /api/admin/audit-logs
 * Protected: ADMIN role only
 */
@RestController
@RequestMapping("/api/admin/audit-logs")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditController {

    private final AuditLogService auditLogService;

    /**
     * GET /api/admin/audit-logs
     * Retrieve all audit logs with pagination and optional filters.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        Page<AuditLog> logs;
        if (action != null || email != null || startDate != null || endDate != null) {
            logs = auditLogService.getLogsFiltered(action, email, startDate, endDate, pageable);
        } else {
            logs = auditLogService.getAllLogs(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("content", logs.getContent());
        response.put("pageNumber", logs.getNumber());
        response.put("pageSize", logs.getSize());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("isFirst", logs.isFirst());
        response.put("isLast", logs.isLast());

        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", response));
    }

    /**
     * GET /api/admin/audit-logs/user/{userId}
     * Retrieve logs for a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getLogsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> logs = auditLogService.getLogsByUser(userId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());

        return ResponseEntity.ok(ApiResponse.success("User audit logs retrieved", response));
    }

    /**
     * GET /api/admin/audit-logs/action/{action}
     * Retrieve logs for a specific action type.
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<ApiResponse<?>> getLogsByAction(
            @PathVariable String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> logs = auditLogService.getLogsByAction(action, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", logs.getContent());
        response.put("totalElements", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());

        return ResponseEntity.ok(ApiResponse.success("Action audit logs retrieved", response));
    }

    /**
     * GET /api/admin/audit-logs/actions
     * Retrieve distinct action types for filter dropdowns.
     */
    @GetMapping("/actions")
    public ResponseEntity<ApiResponse<?>> getDistinctActions() {
        List<String> actions = auditLogService.getDistinctActions();
        return ResponseEntity.ok(ApiResponse.success("Distinct actions retrieved", actions));
    }
}
