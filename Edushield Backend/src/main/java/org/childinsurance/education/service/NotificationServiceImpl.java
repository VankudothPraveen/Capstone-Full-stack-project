package org.childinsurance.education.service;

import lombok.RequiredArgsConstructor;
import org.childinsurance.education.entity.Notification;
import org.childinsurance.education.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Notification createNotification(Long userId, String role, String title, String message, String type, String targetUrl) {
        Notification notification = Notification.builder()
                .userId(userId)
                .recipientRole(role)
                .title(title)
                .message(message)
                .type(type)
                .targetUrl(targetUrl)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(Long userId, String role) {
        if (userId != null && role != null) {
            return notificationRepository.findByUserIdOrRecipientRoleOrderByCreatedAtDesc(userId, role);
        } else if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else if (role != null) {
            return notificationRepository.findByRecipientRoleOrderByCreatedAtDesc(role);
        }
        return List.of();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId, String role) {
        List<Notification> unread;
        if (userId != null && role != null) {
            unread = notificationRepository.findByUserIdOrRecipientRoleOrderByCreatedAtDesc(userId, role);
        } else if (userId != null) {
            unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            unread = notificationRepository.findByRecipientRoleOrderByCreatedAtDesc(role);
        }
        
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
