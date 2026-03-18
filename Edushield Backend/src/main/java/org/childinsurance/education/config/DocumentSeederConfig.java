package org.childinsurance.education.config;

import org.childinsurance.education.entity.Policy;
import org.childinsurance.education.entity.PolicyDocumentRequirement;
import org.childinsurance.education.repository.PolicyDocumentRequirementRepository;
import org.childinsurance.education.repository.PolicyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DocumentSeederConfig {

    @Bean
    public CommandLineRunner loadDocumentRequirements(
            PolicyRepository policyRepository,
            PolicyDocumentRequirementRepository reqRepo) {
        return args -> {
            if (reqRepo.count() == 0) {
                System.out.println("Seeding Document Requirements for Policies...");

                List<Policy> policies = policyRepository.findAll();

                for (Policy p : policies) {
                    if (p.getPolicyName().contains("BrightFuture")) {
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Birth Certificate", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Parent ID Proof", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "School Admission Letter", "CLAIM"));
                    } else if (p.getPolicyName().contains("ScholarSecure")) {
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Previous Year Marksheet", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "College Fee Receipt", "CLAIM"));
                    } else if (p.getPolicyName().contains("DreamAchiever")) {
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Income Proof", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Study Certificate", "APPLICATION"));
                    } else if (p.getPolicyName().contains("Comprehensive")) {
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Aadhar Card", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Medical Certificate", "CLAIM"));
                    } else if (p.getPolicyName().contains("Basic")) {
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "ID Proof", "APPLICATION"));
                        reqRepo.save(new PolicyDocumentRequirement(null, p, "Claim Letter", "CLAIM"));
                    }
                }
                System.out.println("Document Requirements successfully seeded.");
            }
        };
    }
}
