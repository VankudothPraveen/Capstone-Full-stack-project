package org.childinsurance.education.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // The recipient of the notification. Null could mean system-wide/broadcast if needed, but usually specific.
    
    private String recipientRole; // If we want to notify all admins or all underwriters

    private String title;
    
    @Column(length = 500)
    private String message;

    private String type; // APPLICATION, CLAIM, PAYMENT, etc.

    @Builder.Default
    private boolean isRead = false;

    private LocalDateTime createdAt;
    
    private String targetUrl; // Frontend route to navigate to

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
