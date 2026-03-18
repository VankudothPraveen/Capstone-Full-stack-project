package org.childinsurance.education.service;

import org.childinsurance.education.dto.risk.RiskCalculationRequest;
import org.childinsurance.education.dto.risk.RiskCalculationResponse;

public interface RiskAssessmentService {
    RiskCalculationResponse calculateRisk(RiskCalculationRequest request);
}
