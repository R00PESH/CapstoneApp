package training.iqgateway.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import training.admin.iqgateway.dto.event.HospitalCreatedEvent;
import training.iqgateway.model.CustomerEO;
import training.iqgateway.model.Notification;
import training.iqgateway.repo.CustomerRepository;
import training.iqgateway.repo.NotificationRepository;

@Service
public class HospitalNotificationListener {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = "${rabbitmq.queue}")
    public void handleHospitalCreated(HospitalCreatedEvent event) {

        // Fetch all customers, no filter applied
        List<CustomerEO> allCustomers = customerRepository.findAll();

        for (CustomerEO customer : allCustomers) {

            String message = String.format(
                "Check out new hospital's opened that covers your insurance plans!",
                event.getHospitalName());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("hospitalId", event.getHosId());
            metadata.put("hospitalName", event.getHospitalName());
            metadata.put("insurancePlans", event.getInsurancePlans());
            metadata.put("location", event.getLocation());
            metadata.put("zipcode", event.getZipcode());
            metadata.put("lat", event.getLat());
            metadata.put("lon", event.getLon());

            Notification notification = new Notification(
                customer.getAdharNumber(),   // verify this getter matches your CustomerEO field
                "1",                        // senderId as string "1"
                "hospital_created",
                message,
                metadata,
                false,
                new Date()
            );

            notificationRepository.save(notification);

            // Push real-time notification via WebSocket topic specific to customer
            messagingTemplate.convertAndSend(
                "/topic/notifications/" + customer.getAdharNumber(),
                notification);
        }
    }
}
