package org.childinsurance.education.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.document.DocumentResponse;
import org.childinsurance.education.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Document Management", description = "APIs for managing document uploads")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    @Operation(summary = "Upload document")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "applicationId", required = false) Long applicationId,
            @RequestParam(value = "claimId", required = false) Long claimId,
            @RequestParam("documentType") String documentType,
            @RequestParam("userId") Long userId) {

        try {
            DocumentResponse response = documentService.uploadDocument(file, applicationId, claimId, documentType,
                    userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Document uploaded successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "UPLOAD_ERROR"));
        }
    }

    @GetMapping("/application/{applicationId}")
    @Operation(summary = "Get application documents")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocumentsByApplicationId(
            @PathVariable Long applicationId) {
        List<DocumentResponse> documents = documentService.getDocumentsByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
    }

    @GetMapping("/claim/{claimId}")
    @Operation(summary = "Get claim documents")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocumentsByClaimId(@PathVariable Long claimId) {
        List<DocumentResponse> documents = documentService.getDocumentsByClaimId(claimId);
        return ResponseEntity.ok(ApiResponse.success("Documents fetched successfully", documents));
    }

    @DeleteMapping("/{documentId}")
    @Operation(summary = "Delete a document")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "DELETE_ERROR"));
        }
    }

    @GetMapping("/download/{documentId}")
    @Operation(summary = "Download a document")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable Long documentId) {
        try {
            java.nio.file.Path path = documentService.getDocumentFile(documentId);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(path.toUri());

            String contentType = java.nio.file.Files.probeContentType(path);
            if (contentType == null)
                contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + path.getFileName().toString() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
