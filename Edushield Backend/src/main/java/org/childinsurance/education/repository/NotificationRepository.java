package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(String role);
    List<Notification> findByUserIdOrRecipientRoleOrderByCreatedAtDesc(Long userId, String role);
}
