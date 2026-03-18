package org.childinsurance.education.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyDocumentRequirementResponse {
    private Long id;
    private Long policyId;
    private String documentType;
    private String stage;
}
