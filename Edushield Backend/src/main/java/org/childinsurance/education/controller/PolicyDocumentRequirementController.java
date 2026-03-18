package org.childinsurance.education.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.document.PolicyDocumentRequirementRequest;
import org.childinsurance.education.dto.document.PolicyDocumentRequirementResponse;
import org.childinsurance.education.service.PolicyDocumentRequirementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy-document-requirements")
@RequiredArgsConstructor
@Tag(name = "Policy Document Requirement Management", description = "APIs for configuring required documents per policy")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PolicyDocumentRequirementController {

    private final PolicyDocumentRequirementService requirementService;

    @PostMapping
    @Operation(summary = "Create a document requirement for a policy")
    public ResponseEntity<ApiResponse<PolicyDocumentRequirementResponse>> createRequirement(
            @Valid @RequestBody PolicyDocumentRequirementRequest request) {
        try {
            PolicyDocumentRequirementResponse response = requirementService.createRequirement(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Document requirement created successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "CREATE_REQ_ERROR"));
        }
    }

    @GetMapping("/policy/{policyId}/stage/{stage}")
    @Operation(summary = "Get document requirements for a policy at a specific stage")
    public ResponseEntity<ApiResponse<List<PolicyDocumentRequirementResponse>>> getRequirementsByPolicyAndStage(
            @PathVariable Long policyId,
            @PathVariable String stage) {
        List<PolicyDocumentRequirementResponse> requirements = requirementService.getRequirementsForPolicy(policyId,
                stage);
        return ResponseEntity.ok(ApiResponse.success("Requirements fetched successfully", requirements));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a document requirement")
    public ResponseEntity<ApiResponse<Void>> deleteRequirement(@PathVariable Long id) {
        try {
            requirementService.deleteRequirement(id);
            return ResponseEntity.ok(ApiResponse.success("Requirement deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), "DELETE_REQ_ERROR"));
        }
    }
}
