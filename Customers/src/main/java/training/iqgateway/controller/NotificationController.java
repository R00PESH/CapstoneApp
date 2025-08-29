package training.iqgateway.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.model.Notification;
import training.iqgateway.repo.NotificationRepository;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Fetch all notifications for a specific customer Aadhaar number
    @GetMapping("/{aadhaar}")
    public List<Notification> getNotifications(@PathVariable String aadhaar) {
        return notificationRepository.findByReceiverAadhar(aadhaar);
    }

    // Optional: mark notification as read
    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable String id) {
        Notification notif = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notif.setRead(true);
        return notificationRepository.save(notif);
    }

    // Optional: delete a notification
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id) {
        notificationRepository.deleteById(id);
    }
}
