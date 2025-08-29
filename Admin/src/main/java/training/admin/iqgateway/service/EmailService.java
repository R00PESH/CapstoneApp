package training.admin.iqgateway.service;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import training.admin.iqgateway.dto.ProviderDTO;



@Service
public class EmailService {
	
	private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required=true)
    private JavaMailSender mailSender;
    
    @Async
    public void sendHospitalRegistrationEmail(String toEmail, String hospitalName, List<String> insurancePlans, String hosId) {
        if (toEmail == null || toEmail.isBlank()) {
            logger.warn("Email not provided; skipping notification for hospital {}", hospitalName);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        try {
            message.setTo(toEmail);
            message.setSubject("Hospital Registration Successful");

            String plans = (insurancePlans == null || insurancePlans.isEmpty()) ? "None" : String.join(", ", insurancePlans);

            String text = String.format(
                "Dear %s,\n\n"
              + "Congratulations! Your hospital has been successfully registered.\n"
              + "Insurance Plans: %s\n"
              + "Hospital ID: %s\n\n"
              + "Thank you for joining our platform.\n\n"
              + "Best regards,\n"
              + "Health Connect",
              hospitalName, plans, hosId);

            message.setText(text);

            mailSender.send(message);

            logger.info("Registration email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send notification email to {} (Hospital: {})", toEmail, hospitalName, e);
        }
    }

        
    
}
