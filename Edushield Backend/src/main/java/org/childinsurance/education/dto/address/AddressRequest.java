package org.childinsurance.education.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for address request (create/update)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    @NotBlank(message = "Street is required")
    @Size(min = 5, max = 255, message = "Street must be between 5 and 255 characters")
    private String street;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100, message = "City must be between 2 and 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(min = 2, max = 100, message = "State must be between 2 and 100 characters")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Size(min = 5, max = 10, message = "Pincode must be between 5 and 10 characters")
    private String pincode;

    private Long userId;
}

