package org.childinsurance.education.controller;

import lombok.AllArgsConstructor;
import org.childinsurance.education.service.ExcelExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Admin Export Controller
 * Base URL: /api/admin/export
 * Protected: ADMIN role only
 */
@RestController
@RequestMapping("/api/admin/export")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminExportController {

    private final ExcelExportService excelExportService;

    @GetMapping("/users")
    public ResponseEntity<byte[]> exportUsers() throws IOException {
        byte[] data = excelExportService.exportUsersToExcel();
        return buildExcelResponse(data, "users_export.xlsx");
    }

    @GetMapping("/policies")
    public ResponseEntity<byte[]> exportPolicies() throws IOException {
        byte[] data = excelExportService.exportPoliciesToExcel();
        return buildExcelResponse(data, "policies_export.xlsx");
    }

    @GetMapping("/applications")
    public ResponseEntity<byte[]> exportApplications() throws IOException {
        byte[] data = excelExportService.exportApplicationsToExcel();
        return buildExcelResponse(data, "applications_export.xlsx");
    }

    @GetMapping("/claims")
    public ResponseEntity<byte[]> exportClaims() throws IOException {
        byte[] data = excelExportService.exportClaimsToExcel();
        return buildExcelResponse(data, "claims_export.xlsx");
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<byte[]> exportAuditLogs() throws IOException {
        byte[] data = excelExportService.exportAuditLogsToExcel();
        return buildExcelResponse(data, "audit_logs_export.xlsx");
    }

    private ResponseEntity<byte[]> buildExcelResponse(byte[] data, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
