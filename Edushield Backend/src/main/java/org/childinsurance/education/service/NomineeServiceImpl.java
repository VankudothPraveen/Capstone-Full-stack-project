package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.nominee.NomineeRequest;
import org.childinsurance.education.dto.nominee.NomineeResponse;
import org.childinsurance.education.entity.Nominee;
import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.repository.NomineeRepository;
import org.childinsurance.education.repository.PolicyApplicationRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class NomineeServiceImpl implements NomineeService {

    private final NomineeRepository nomineeRepository;
    private final PolicyApplicationRepository policyApplicationRepository;

    @Override
    public NomineeResponse addNominee(NomineeRequest request) {
        log.info("Adding nominee for application: {}", request.getApplicationId());

        PolicyApplication application = policyApplicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Nominee nominee = Nominee.builder()
                .nomineeName(request.getNomineeName())
                .relationship(request.getRelationship())
                .phone(request.getPhone())
                .policyApplication(application)
                .build();

        Nominee savedNominee = nomineeRepository.save(nominee);
        log.info("Nominee added successfully with ID: {}", savedNominee.getNomineeId());

        return mapToResponse(savedNominee);
    }

    @Override
    @Transactional(readOnly = true)
    public NomineeResponse getNomineeByApplicationId(Long applicationId) {
        log.info("Fetching nominee for application: {}", applicationId);

        Nominee nominee = nomineeRepository.findByPolicyApplicationApplicationId(applicationId)
                .orElseThrow(() -> {
                    log.error("Nominee not found for application: {}", applicationId);
                    return new RuntimeException("Nominee not found");
                });

        return mapToResponse(nominee);
    }

    @Override
    public NomineeResponse updateNominee(Long nomineeId, NomineeRequest request) {
        log.info("Updating nominee with ID: {}", nomineeId);

        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> {
                    log.error("Nominee not found with ID: {}", nomineeId);
                    return new RuntimeException("Nominee not found");
                });

        nominee.setNomineeName(request.getNomineeName());
        nominee.setRelationship(request.getRelationship());
        nominee.setPhone(request.getPhone());

        Nominee updatedNominee = nomineeRepository.save(nominee);
        log.info("Nominee updated successfully");

        return mapToResponse(updatedNominee);
    }

    @Override
    public void deleteNominee(Long nomineeId) {
        log.info("Deleting nominee with ID: {}", nomineeId);

        Nominee nominee = nomineeRepository.findById(nomineeId)
                .orElseThrow(() -> {
                    log.error("Nominee not found with ID: {}", nomineeId);
                    return new RuntimeException("Nominee not found");
                });

        nomineeRepository.delete(nominee);
        log.info("Nominee deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NomineeResponse> getMyNominees(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching nominees for user: {}", userId);
        return nomineeRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    private NomineeResponse mapToResponse(Nominee nominee) {
        return NomineeResponse.builder()
                .nomineeId(nominee.getNomineeId())
                .nomineeName(nominee.getNomineeName())
                .relationship(nominee.getRelationship())
                .phone(nominee.getPhone())
                .applicationId(nominee.getPolicyApplication().getApplicationId())
                .build();
    }
}
