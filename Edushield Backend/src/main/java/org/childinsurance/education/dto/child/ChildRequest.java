package org.childinsurance.education.dto.child;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for child request (create/update)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildRequest {

    @NotBlank(message = "Child name is required")
    @Size(min = 2, max = 100, message = "Child name must be between 2 and 100 characters")
    private String childName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String schoolName;

    private String educationGoal;
}

