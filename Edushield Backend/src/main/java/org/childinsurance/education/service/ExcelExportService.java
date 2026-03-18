package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.childinsurance.education.entity.*;
import org.childinsurance.education.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service to generate Excel files for admin data export.
 * Uses Apache POI with streaming-friendly patterns.
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ExcelExportService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final PolicyApplicationRepository applicationRepository;
    private final ClaimRepository claimRepository;
    private final AuditLogRepository auditLogRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ─── Users ──────────────────────────────────────────────────────

    public byte[] exportUsersToExcel() throws IOException {
        log.info("Generating Users Excel export");
        List<User> users = userRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Name", "Email", "Phone", "Role", "Provider", "Created At"};
            createHeaderRow(sheet, headers, headerStyle);

            int rowIdx = 1;
            for (User u : users) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(u.getUserId());
                row.createCell(1).setCellValue(safe(u.getName()));
                row.createCell(2).setCellValue(safe(u.getEmail()));
                row.createCell(3).setCellValue(safe(u.getPhone()));
                row.createCell(4).setCellValue(u.getRole() != null ? u.getRole().getRoleName() : "");
                row.createCell(5).setCellValue(safe(u.getProvider()));
                row.createCell(6).setCellValue(u.getCreatedAt() != null ? u.getCreatedAt().format(DATETIME_FMT) : "");
            }

            autoSizeColumns(sheet, headers.length);
            return toBytes(workbook);
        }
    }

    // ─── Policies ───────────────────────────────────────────────────

    public byte[] exportPoliciesToExcel() throws IOException {
        log.info("Generating Policies Excel export");
        List<Policy> policies = policyRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Policies");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "Policy Name", "Description", "Base Premium", "Risk Coverage",
                    "Duration (Years)", "Active"};
            createHeaderRow(sheet, headers, headerStyle);

            int rowIdx = 1;
            for (Policy p : policies) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getPolicyId());
                row.createCell(1).setCellValue(safe(p.getPolicyName()));
                row.createCell(2).setCellValue(safe(p.getDescription()));
                row.createCell(3).setCellValue(p.getBasePremium() != null ? p.getBasePremium().doubleValue() : 0);
                row.createCell(4).setCellValue(p.getRiskCoverageAmount() != null ? p.getRiskCoverageAmount().doubleValue() : 0);
                row.createCell(5).setCellValue(p.getDurationYears() != null ? p.getDurationYears() : 0);
                row.createCell(6).setCellValue(Boolean.TRUE.equals(p.getIsActive()) ? "Yes" : "No");
            }

            autoSizeColumns(sheet, headers.length);
            return toBytes(workbook);
        }
    }

    // ─── Applications ───────────────────────────────────────────────

    public byte[] exportApplicationsToExcel() throws IOException {
        log.info("Generating Applications Excel export");
        List<PolicyApplication> applications = applicationRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Applications");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"App ID", "Policy Number", "Policy Name", "Applicant",
                    "Child Name", "Status", "Application Date", "Approval Date",
                    "Calculated Premium", "Risk Score", "Risk Category"};
            createHeaderRow(sheet, headers, headerStyle);

            int rowIdx = 1;
            for (PolicyApplication a : applications) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(a.getApplicationId());
                row.createCell(1).setCellValue(safe(a.getPolicyNumber()));
                row.createCell(2).setCellValue(a.getPolicy() != null ? safe(a.getPolicy().getPolicyName()) : "");
                row.createCell(3).setCellValue(a.getUser() != null ? safe(a.getUser().getName()) : "");
                row.createCell(4).setCellValue(a.getChild() != null ? safe(a.getChild().getChildName()) : "");
                row.createCell(5).setCellValue(safe(a.getStatus()));
                row.createCell(6).setCellValue(a.getApplicationDate() != null ? a.getApplicationDate().format(DATE_FMT) : "");
                row.createCell(7).setCellValue(a.getApprovalDate() != null ? a.getApprovalDate().format(DATE_FMT) : "");
                row.createCell(8).setCellValue(a.getCalculatedPremium() != null ? a.getCalculatedPremium().doubleValue() : 0);
                row.createCell(9).setCellValue(a.getRiskScore() != null ? a.getRiskScore() : 0);
                row.createCell(10).setCellValue(safe(a.getRiskCategory()));
            }

            autoSizeColumns(sheet, headers.length);
            return toBytes(workbook);
        }
    }

    // ─── Claims ─────────────────────────────────────────────────────

    public byte[] exportClaimsToExcel() throws IOException {
        log.info("Generating Claims Excel export");
        List<Claim> claims = claimRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Claims");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"Claim ID", "Claim Type", "Claim Amount", "Status",
                    "Claim Date", "Approval Date", "Payout Date", "Rejection Reason", "User"};
            createHeaderRow(sheet, headers, headerStyle);

            int rowIdx = 1;
            for (Claim c : claims) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(c.getClaimId());
                row.createCell(1).setCellValue(safe(c.getClaimType()));
                row.createCell(2).setCellValue(c.getClaimAmount() != null ? c.getClaimAmount().doubleValue() : 0);
                row.createCell(3).setCellValue(safe(c.getStatus()));
                row.createCell(4).setCellValue(c.getClaimDate() != null ? c.getClaimDate().format(DATE_FMT) : "");
                row.createCell(5).setCellValue(c.getApprovalDate() != null ? c.getApprovalDate().format(DATE_FMT) : "");
                row.createCell(6).setCellValue(c.getPayoutDate() != null ? c.getPayoutDate().format(DATE_FMT) : "");
                row.createCell(7).setCellValue(safe(c.getRejectionReason()));
                row.createCell(8).setCellValue(c.getUser() != null ? safe(c.getUser().getName()) : "");
            }

            autoSizeColumns(sheet, headers.length);
            return toBytes(workbook);
        }
    }

    // ─── Audit Logs ─────────────────────────────────────────────────

    public byte[] exportAuditLogsToExcel() throws IOException {
        log.info("Generating Audit Logs Excel export");
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Audit Logs");
            CellStyle headerStyle = createHeaderStyle(workbook);

            String[] headers = {"ID", "User Email", "Role", "Action", "Entity Type",
                    "Entity ID", "Description", "Timestamp"};
            createHeaderRow(sheet, headers, headerStyle);

            int rowIdx = 1;
            for (AuditLog l : logs) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(l.getId());
                row.createCell(1).setCellValue(safe(l.getUserEmail()));
                row.createCell(2).setCellValue(safe(l.getRole()));
                row.createCell(3).setCellValue(safe(l.getAction()));
                row.createCell(4).setCellValue(safe(l.getEntityType()));
                row.createCell(5).setCellValue(l.getEntityId() != null ? l.getEntityId() : 0);
                row.createCell(6).setCellValue(safe(l.getDescription()));
                row.createCell(7).setCellValue(l.getTimestamp() != null ? l.getTimestamp().format(DATETIME_FMT) : "");
            }

            autoSizeColumns(sheet, headers.length);
            return toBytes(workbook);
        }
    }

    // ─── Helper Methods ────────────────────────────────────────────

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private void createHeaderRow(Sheet sheet, String[] headers, CellStyle style) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(style);
        }
    }

    private void autoSizeColumns(Sheet sheet, int columnCount) {
        for (int i = 0; i < columnCount; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private byte[] toBytes(XSSFWorkbook workbook) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private String safe(String value) {
        return value != null ? value : "";
    }
}
