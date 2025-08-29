package training.iqgateway.repo;



import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import training.iqgateway.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverAadhar(String receiverAadhar);
}