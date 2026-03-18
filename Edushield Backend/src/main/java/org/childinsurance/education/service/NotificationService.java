package org.childinsurance.education.service;

import org.childinsurance.education.entity.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String role, String title, String message, String type, String targetUrl);
    List<Notification> getNotificationsForUser(Long userId, String role);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId, String role);
}
