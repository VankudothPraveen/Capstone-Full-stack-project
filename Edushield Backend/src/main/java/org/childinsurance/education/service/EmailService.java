package org.childinsurance.education.service;

/**
 * Email Service Interface
 * Defines the contract for sending all email notifications
 * in the Child Education Insurance platform.
 */
public interface EmailService {

    /**
     * Send a plain/simple transactional email.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param body    plain-text email body
     */
    void sendSimpleEmail(String to, String subject, String body);

    /**
     * Send an email with a file attachment.
     *
     * @param to                 recipient email address
     * @param subject            email subject
     * @param body               plain-text email body
     * @param attachmentData     byte array of the attachment
     * @param attachmentFilename file name for the attachment
     */
    void sendEmailWithAttachment(String to, String subject, String body, byte[] attachmentData, String attachmentFilename);

    /**
     * Send a welcome email after a new user registers.
     *
     * @param toEmail  recipient email address
     * @param userName registered user's display name
     */
    void sendRegistrationEmail(String toEmail, String userName);

    /**
     * Send a password reset email with an OTP.
     *
     * @param toEmail  recipient email address
     * @param userName user's display name
     * @param resetCode 6-digit OTP code
     */
    void sendPasswordResetEmail(String toEmail, String userName, String resetCode);

    /**
     * Send a notification when a policy application is submitted.
     *
     * @param toEmail       recipient email address
     * @param userName      applicant's name
     * @param applicationId unique application identifier
     * @param policyName    name of the policy applied for
     */
    void sendApplicationSubmittedEmail(String toEmail, String userName,
                                       Long applicationId, String policyName);

    /**
     * Send a notification when a policy application is approved.
     *
     * @param toEmail       recipient email address
     * @param userName      applicant's name
     * @param applicationId unique application identifier
     * @param policyName    name of the approved policy
     */
    void sendApplicationApprovedEmail(String toEmail, String userName,
                                      Long applicationId, String policyName);

    /**
     * Send a notification when a policy application is rejected.
     *
     * @param toEmail  recipient email address
     * @param userName applicant's name
     */
    void sendApplicationRejectedEmail(String toEmail, String userName);

    /**
     * Send a notification when a claim is submitted.
     *
     * @param toEmail  recipient email address
     * @param userName claimant's name
     * @param claimId  unique claim identifier
     */
    void sendClaimSubmittedEmail(String toEmail, String userName, Long claimId);

    /**
     * Send a notification when a claim is approved.
     *
     * @param toEmail  recipient email address
     * @param userName claimant's name
     * @param claimId  unique claim identifier
     */
    void sendClaimApprovedEmail(String toEmail, String userName, Long claimId);

    /**
     * Send a notification when a claim is rejected.
     *
     * @param toEmail  recipient email address
     * @param userName claimant's name
     * @param claimId  unique claim identifier
     */
    void sendClaimRejectedEmail(String toEmail, String userName, Long claimId);
}
