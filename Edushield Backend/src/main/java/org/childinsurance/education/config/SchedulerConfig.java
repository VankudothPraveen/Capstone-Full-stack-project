package org.childinsurance.education.config;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.service.PolicySubscriptionService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
@AllArgsConstructor
@Slf4j
public class SchedulerConfig {

    private final PolicySubscriptionService policySubscriptionService;

    /**
     * Process matured subscriptions daily at midnight
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void processMaturedSubscriptions() {
        log.info("Starting scheduled maturity processing");
        try {
            policySubscriptionService.processMaturedSubscriptions();
            log.info("Completed scheduled maturity processing");
        } catch (Exception e) {
            log.error("Error processing matured subscriptions", e);
        }
    }
}
