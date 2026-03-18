package org.childinsurance.education.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.childinsurance.education.dto.common.ApiResponse;
import org.childinsurance.education.dto.common.PaginationResponse;
import org.childinsurance.education.dto.nominee.NomineeRequest;
import org.childinsurance.education.dto.nominee.NomineeResponse;
import org.childinsurance.education.service.NomineeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nominees")
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class NomineeController {

    private final NomineeService nomineeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> addNominee(@Valid @RequestBody NomineeRequest request) {
        NomineeResponse response = nomineeService.addNominee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Nominee added successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> getMyNominees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NomineeResponse> nominees = nomineeService.getMyNominees(pageable);
        return ResponseEntity.ok(PaginationResponse.success(
                "Nominees retrieved successfully",
                nominees.getContent(),
                nominees.getNumber(),
                nominees.getSize(),
                nominees.getTotalElements(),
                nominees.getTotalPages()
        ));
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> getNomineeByApplication(@PathVariable Long applicationId) {
        NomineeResponse response = nomineeService.getNomineeByApplicationId(applicationId);
        return ResponseEntity.ok(ApiResponse.success("Nominee retrieved successfully", response));
    }

    @PutMapping("/{nomineeId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateNominee(
            @PathVariable Long nomineeId,
            @Valid @RequestBody NomineeRequest request) {
        NomineeResponse response = nomineeService.updateNominee(nomineeId, request);
        return ResponseEntity.ok(ApiResponse.success("Nominee updated successfully", response));
    }

    @DeleteMapping("/{nomineeId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteNominee(@PathVariable Long nomineeId) {
        nomineeService.deleteNominee(nomineeId);
        return ResponseEntity.ok(ApiResponse.success("Nominee deleted successfully", null));
    }
}
