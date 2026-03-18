package org.childinsurance.education.service;

import org.childinsurance.education.dto.application.PolicyApplicationRequest;
import org.childinsurance.education.dto.application.PolicyApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PolicyApplicationService {
    PolicyApplicationResponse applyForPolicy(PolicyApplicationRequest request);
    Page<PolicyApplicationResponse> getMyApplications(Pageable pageable);
    Page<PolicyApplicationResponse> getAllApplications(Pageable pageable);
    PolicyApplicationResponse getApplicationById(Long applicationId);
    PolicyApplicationResponse approveApplication(Long applicationId, java.math.BigDecimal revisedPremium);
    PolicyApplicationResponse rejectApplication(Long applicationId, String rejectionReason);
    PolicyApplicationResponse cancelApplication(Long applicationId);
    PolicyApplicationResponse updateApplicationStatus(Long applicationId, String status);
    byte[] downloadCertificate(Long applicationId);
}
