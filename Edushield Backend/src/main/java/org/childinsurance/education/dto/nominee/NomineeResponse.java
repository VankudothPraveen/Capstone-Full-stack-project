package org.childinsurance.education.dto.nominee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for nominee response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NomineeResponse {
    private Long nomineeId;
    private String nomineeName;
    private String relationship;
    private String phone;
    private Long applicationId;
}

