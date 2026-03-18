package org.childinsurance.education.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDocumentRequirementRequest {
    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotBlank(message = "Document type is required")
    private String documentType;

    @NotBlank(message = "Stage is required (APPLICATION or CLAIM)")
    private String stage;
}
