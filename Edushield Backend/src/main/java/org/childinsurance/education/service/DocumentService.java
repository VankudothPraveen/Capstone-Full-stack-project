package org.childinsurance.education.service;

import org.childinsurance.education.dto.document.DocumentResponse;
import org.childinsurance.education.entity.Claim;
import org.childinsurance.education.entity.Document;
import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.repository.ClaimRepository;
import org.childinsurance.education.repository.DocumentRepository;
import org.childinsurance.education.repository.PolicyApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private PolicyApplicationRepository policyApplicationRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Value("${file.upload-dir:uploads/policy-documents}")
    private String uploadDir;

    @Transactional
    public DocumentResponse uploadDocument(MultipartFile file, Long applicationId, Long claimId, String documentType,
            Long userId) throws IOException {
        PolicyApplication application = null;
        if (applicationId != null) {
            application = policyApplicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
        }

        Claim claim = null;
        if (claimId != null) {
            claim = claimRepository.findById(claimId)
                    .orElseThrow(() -> new RuntimeException("Claim not found"));
        }

        if (application == null && claim == null) {
            throw new RuntimeException("Either Application ID or Claim ID must be provided");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") &&
                !contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new RuntimeException("Invalid file format. Only PDF, JPG, and PNG are allowed.");
        }

        // Validate file size
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds maximum limit of 5MB");
        }

        // Save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String savedFileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(savedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save entity to DB
        Document document = Document.builder()
                .documentType(documentType)
                .fileName(originalFilename)
                .filePath(filePath.toString())
                .uploadDate(LocalDateTime.now())
                .policyApplication(application)
                .claim(claim)
                .uploadedByUserId(userId)
                .build();

        document = documentRepository.save(document);

        return mapToResponse(document);
    }

    public List<DocumentResponse> getDocumentsByApplicationId(Long applicationId) {
        return documentRepository.findByPolicyApplication_ApplicationId(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentResponse> getDocumentsByClaimId(Long claimId) {
        return documentRepository.findByClaim_ClaimId(claimId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete file from disk
        try {
            Path fileToDeletePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(fileToDeletePath);
        } catch (IOException e) {
            // Log but still try to delete from DB
        }

        documentRepository.delete(document);
    }

    public Path getDocumentFile(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return Paths.get(document.getFilePath());
    }

    private DocumentResponse mapToResponse(Document document) {
        return DocumentResponse.builder()
                .documentId(document.getDocumentId())
                .documentType(document.getDocumentType())
                .fileName(document.getFileName())
                .uploadDate(document.getUploadDate())
                .policyApplicationId(
                        document.getPolicyApplication() != null ? document.getPolicyApplication().getApplicationId()
                                : null)
                .claimId(document.getClaim() != null ? document.getClaim().getClaimId() : null)
                .uploadedByUserId(document.getUploadedByUserId())
                .build();
    }
}
