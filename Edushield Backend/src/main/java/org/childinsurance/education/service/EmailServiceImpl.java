package org.childinsurance.education.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.io.ByteArrayResource;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * EmailServiceImpl
 *
 * Sends transactional email notifications for all major workflow events
 * in the Child Education Insurance platform.
 *
 * All email-sending methods are wrapped in try-catch blocks so that a
 * failed email delivery NEVER interrupts or rolls back a business transaction.
 *
 * All methods are marked @Async so that the user doesn't wait for the connection.
 */
@Service
@Slf4j
@Async
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${app.mail.from.name:Child Education Insurance}")
    private String fromName;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // -------------------------------------------------------------------------
    // Generic helper
    // -------------------------------------------------------------------------

    @Override
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromName + " <" + fromAddress + ">");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("[EMAIL] Sent '{}' to {}", subject, to);
        } catch (MailException ex) {
            log.error("[EMAIL] Failed to send '{}' to {} : {}. Note: User registered successfully and can still login.", subject, to, ex.getMessage());
        } catch (Exception ex) {
            log.error("[EMAIL] Unexpected error sending email to {} : {}. User can still login.", to, ex.getMessage());
        }
    }

    @Override
    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachmentData, String attachmentFilename) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart message
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromName + " <" + fromAddress + ">");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            
            if (attachmentData != null && attachmentFilename != null) {
                helper.addAttachment(attachmentFilename, new ByteArrayResource(attachmentData));
            }
            
            mailSender.send(message);
            log.info("[EMAIL] Sent '{}' with attachment {} to {}", subject, attachmentFilename, to);
        } catch (MailException ex) {
            log.error("[EMAIL] Failed to send '{}' with attachment to {} : {}", subject, to, ex.getMessage());
        } catch (Exception ex) {
            log.error("[EMAIL] Unexpected error sending email with attachment to {} : {}", to, ex.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Registration
    // -------------------------------------------------------------------------

    @Override
    public void sendRegistrationEmail(String toEmail, String userName) {
        String subject = "Welcome to Child Education Insurance Platform";
        String body = buildRegistrationBody(userName);
        log.info("[EMAIL] Sending registration welcome email to {}", toEmail);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildRegistrationBody(String userName) {
        return  "Dear " + userName + ",\n\n"
              + "Welcome to the Child Education Insurance Platform.\n\n"
              + "Your account has been successfully created.\n\n"
              + "You can now explore our education insurance policies and secure your child's future.\n\n"
              + "Best regards,\n"
              + "Insurance Support Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Password Reset
    // -------------------------------------------------------------------------

    @Override
    public void sendPasswordResetEmail(String toEmail, String userName, String resetCode) {
        String subject = "Password Reset - Child Education Insurance Platform";
        String body = buildPasswordResetBody(userName, resetCode);
        log.info("[EMAIL] Sending password reset email to {}", toEmail);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildPasswordResetBody(String userName, String resetCode) {
        return  "Dear " + userName + ",\n\n"
              + "We received a request to reset your password.\n\n"
              + "Your password reset code is: " + resetCode + "\n\n"
              + "This code will expire in 15 minutes.\n\n"
              + "If you did not request a password reset, please ignore this email.\n\n"
              + "Best regards,\n"
              + "Insurance Support Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Policy Application – Submitted
    // -------------------------------------------------------------------------

    @Override
    public void sendApplicationSubmittedEmail(String toEmail, String userName,
                                              Long applicationId, String policyName) {
        String subject = "Policy Application Submitted Successfully";
        String body = buildApplicationSubmittedBody(userName, applicationId, policyName);
        log.info("[EMAIL] Sending application-submitted email to {} for application #{}", toEmail, applicationId);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildApplicationSubmittedBody(String userName, Long applicationId, String policyName) {
        return  "Dear " + userName + ",\n\n"
              + "Your policy application has been successfully submitted.\n\n"
              + "Application ID : " + applicationId + "\n"
              + "Policy         : " + policyName + "\n\n"
              + "Our underwriting team will review your application shortly.\n\n"
              + "You will receive another notification once the review is complete.\n\n"
              + "Thank you for choosing our insurance services.\n\n"
              + "Regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Policy Application – Approved
    // -------------------------------------------------------------------------

    @Override
    public void sendApplicationApprovedEmail(String toEmail, String userName,
                                             Long applicationId, String policyName) {
        String subject = "Your Policy Application Has Been Approved";
        String body = buildApplicationApprovedBody(userName, applicationId, policyName);
        log.info("[EMAIL] Sending application-approved email to {} for application #{}", toEmail, applicationId);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildApplicationApprovedBody(String userName, Long applicationId, String policyName) {
        return  "Dear " + userName + ",\n\n"
              + "Congratulations!\n\n"
              + "Your policy application has been approved.\n\n"
              + "Policy         : " + policyName + "\n"
              + "Application ID : " + applicationId + "\n\n"
              + "You can now proceed with premium payments to activate your policy.\n\n"
              + "We are committed to securing your child's educational future.\n\n"
              + "Best regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Policy Application – Rejected
    // -------------------------------------------------------------------------

    @Override
    public void sendApplicationRejectedEmail(String toEmail, String userName) {
        String subject = "Policy Application Update";
        String body = buildApplicationRejectedBody(userName);
        log.info("[EMAIL] Sending application-rejected email to {}", toEmail);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildApplicationRejectedBody(String userName) {
        return  "Dear " + userName + ",\n\n"
              + "Thank you for applying for an education insurance policy.\n\n"
              + "After reviewing your application, we regret to inform you that it was not "
              + "approved at this time.\n\n"
              + "If you need assistance or further clarification, please contact our support team.\n\n"
              + "Regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Claim – Submitted
    // -------------------------------------------------------------------------

    @Override
    public void sendClaimSubmittedEmail(String toEmail, String userName, Long claimId) {
        String subject = "Claim Request Received";
        String body = buildClaimSubmittedBody(userName, claimId);
        log.info("[EMAIL] Sending claim-submitted email to {} for claim #{}", toEmail, claimId);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildClaimSubmittedBody(String userName, Long claimId) {
        return  "Dear " + userName + ",\n\n"
              + "Your claim request has been successfully submitted.\n\n"
              + "Claim ID : " + claimId + "\n\n"
              + "Our claims officer will review the submitted details and supporting documents.\n\n"
              + "You will be notified once the claim review process is completed.\n\n"
              + "Regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Claim – Approved
    // -------------------------------------------------------------------------

    @Override
    public void sendClaimApprovedEmail(String toEmail, String userName, Long claimId) {
        String subject = "Claim Approved";
        String body = buildClaimApprovedBody(userName, claimId);
        log.info("[EMAIL] Sending claim-approved email to {} for claim #{}", toEmail, claimId);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildClaimApprovedBody(String userName, Long claimId) {
        return  "Dear " + userName + ",\n\n"
              + "We are pleased to inform you that your claim has been approved.\n\n"
              + "Claim ID : " + claimId + "\n\n"
              + "The approved claim amount will be processed according to the policy terms.\n\n"
              + "Thank you for trusting our insurance services.\n\n"
              + "Best regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }

    // -------------------------------------------------------------------------
    // Claim – Rejected
    // -------------------------------------------------------------------------

    @Override
    public void sendClaimRejectedEmail(String toEmail, String userName, Long claimId) {
        String subject = "Claim Review Update";
        String body = buildClaimRejectedBody(userName, claimId);
        log.info("[EMAIL] Sending claim-rejected email to {} for claim #{}", toEmail, claimId);
        sendSimpleEmail(toEmail, subject, body);
    }

    private String buildClaimRejectedBody(String userName, Long claimId) {
        return  "Dear " + userName + ",\n\n"
              + "Your claim request has been reviewed.\n\n"
              + "Claim ID : " + claimId + "\n\n"
              + "Unfortunately, the claim could not be approved based on the submitted information.\n\n"
              + "If you believe additional information should be considered, please contact our support team.\n\n"
              + "Regards,\n"
              + "Insurance Team\n"
              + "Child Education Insurance Platform";
    }
}
