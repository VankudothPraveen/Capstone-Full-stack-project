package org.childinsurance.education.controller;

import lombok.RequiredArgsConstructor;
import org.childinsurance.education.entity.Notification;
import org.childinsurance.education.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, role));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String role) {
        notificationService.markAllAsRead(userId, role);
        return ResponseEntity.ok().build();
    }
}
