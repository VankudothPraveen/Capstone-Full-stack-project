package org.childinsurance.education.service;

import org.childinsurance.education.dto.nominee.NomineeRequest;
import org.childinsurance.education.dto.nominee.NomineeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NomineeService {
    NomineeResponse addNominee(NomineeRequest request);
    NomineeResponse getNomineeByApplicationId(Long applicationId);
    NomineeResponse updateNominee(Long nomineeId, NomineeRequest request);
    void deleteNominee(Long nomineeId);
    Page<NomineeResponse> getMyNominees(Pageable pageable);
}
