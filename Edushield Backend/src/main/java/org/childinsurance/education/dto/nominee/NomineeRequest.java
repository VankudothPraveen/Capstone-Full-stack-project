package org.childinsurance.education.dto.nominee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for nominee request (create/update)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NomineeRequest {

    @NotBlank(message = "Nominee name is required")
    @Size(min = 2, max = 100, message = "Nominee name must be between 2 and 100 characters")
    private String nomineeName;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "Phone is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    private String phone;

    @NotNull(message = "Application ID is required")
    private Long applicationId;
}

