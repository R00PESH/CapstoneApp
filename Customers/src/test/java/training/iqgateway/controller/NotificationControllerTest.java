package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.iqgateway.model.Notification;
import training.iqgateway.repo.NotificationRepository;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getNotifications_shouldReturnList() throws Exception {
        Notification notif = buildSampleNotification();

        Mockito.when(notificationRepository.findByReceiverAadhar("123456789012"))
               .thenReturn(List.of(notif));

        mockMvc.perform(get("/notifications/123456789012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].receiverAadhar").value("123456789012"))
                .andExpect(jsonPath("$[0].type").value("hospital_created"))
                .andExpect(jsonPath("$[0].read").value(true));
    }

    @Test
    void markAsRead_shouldUpdateAndReturnNotification() throws Exception {
        Notification existing = buildSampleNotification();
        existing.setRead(false);

        Notification updated = buildSampleNotification();
        updated.setRead(true);

        Mockito.when(notificationRepository.findById("notif123")).thenReturn(Optional.of(existing));
        Mockito.when(notificationRepository.save(any(Notification.class))).thenReturn(updated);

        mockMvc.perform(put("/notifications/notif123/read"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true))
                .andExpect(jsonPath("$.id").value("notif123"));
    }

    @Test
    void deleteNotification_shouldCallRepositoryDelete() throws Exception {
        mockMvc.perform(delete("/notifications/notif123"))
                .andExpect(status().isOk());

        Mockito.verify(notificationRepository).deleteById("notif123");
    }

    // Helper method to build a mock Notification
    private Notification buildSampleNotification() {
        Map<String, Object> meta = new HashMap<>();
        meta.put("hospitalId", "Hos@201");
        meta.put("hospitalName", "Delhi Heart Hospital");
        meta.put("location", "Delhi");
        meta.put("lat", 28.653229);
        meta.put("lon", 77.308601);

        Notification n = new Notification();
        n.setId("notif123");
        n.setReceiverAadhar("123456789012");
        n.setSenderId("1");
        n.setType("hospital_created");
        n.setMessage("Check out new hospital Delhi Heart Hospital opened that covers your insurance!");
        n.setMetadata(meta);
        n.setRead(true);
        n.setCreatedAt(new Date());
        return n;
    }
}
