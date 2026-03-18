package org.childinsurance.education.dto.child;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for child response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildResponse {
    private Long childId;
    private String childName;
    private LocalDate dateOfBirth;
    private String gender;
    private String schoolName;
    private String educationGoal;
    private Long userId;
}

