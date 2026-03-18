package org.childinsurance.education.service;

import org.childinsurance.education.entity.PolicyApplication;
import org.childinsurance.education.entity.PolicySubscription;

public interface PdfService {
    /**
     * Generates a beautifully formatted PDF certificate array for an approved policy.
     *
     * @param application  The approved policy application
     * @param subscription The generated policy subscription
     * @return PDF byte array
     */
    byte[] generatePolicyCertificate(PolicyApplication application, PolicySubscription subscription);
}
