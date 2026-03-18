package org.childinsurance.education.controller;

import lombok.RequiredArgsConstructor;
import org.childinsurance.education.dto.risk.RiskCalculationRequest;
import org.childinsurance.education.dto.risk.RiskCalculationResponse;
import org.childinsurance.education.service.RiskAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Or match your security config
public class RiskController {

    private final RiskAssessmentService riskAssessmentService;

    @PostMapping("/calculate")
    public ResponseEntity<RiskCalculationResponse> calculateRisk(@RequestBody RiskCalculationRequest request) {
        return ResponseEntity.ok(riskAssessmentService.calculateRisk(request));
    }
}
