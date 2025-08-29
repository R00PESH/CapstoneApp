//package training.iqgateway.service.impl;
//
//import java.time.Instant;
//import java.time.temporal.ChronoUnit;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class OtpService {
//	
//	 @Autowired
//	 private JavaMailSender mailSender;
//
//    private Map<String, String> otpStore = new ConcurrentHashMap<>();
//    private Map<String, Instant> otpExpiry = new ConcurrentHashMap<>();
//
//    private final int OTP_EXPIRY_MINUTES = 10;
//
//    // Generate random OTP and store it with expiry
//    public String generateOtp(String email) {
//        String otp = String.valueOf((int)((Math.random() * 900000) + 100000)); // 6-digit OTP
//        otpStore.put(email, otp);
//        otpExpiry.put(email, Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES));
//
//        // TODO: trigger email sending here with OTP
//        sendOtpEmail(email, otp);
//
//        return otp;
//    }
//
//    public boolean validateOtp(String email, String otp) {
//        if (!otpStore.containsKey(email)) return false;
//        if (Instant.now().isAfter(otpExpiry.get(email))) {
//            otpStore.remove(email);
//            otpExpiry.remove(email);
//            return false;
//        }
//        boolean valid = otpStore.get(email).equals(otp);
//        if (valid) {
//            otpStore.remove(email);
//            otpExpiry.remove(email);
//        }
//        return valid;
//    }
//
//    public void sendOtpEmail(String email, String otp) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setTo(email);
//            message.setSubject("Your OTP for Password Reset");
//            message.setText("Dear user,\n\nYour OTP for password reset is: " + otp + "\n\n"
//                + "This OTP is valid for 10 minutes. Please do not share it with anyone.\n\n"
//                + "If you did not request this, please ignore this email.\n\n"
//                + "Best regards,\nHealthConnect Team");
//            mailSender.send(message);
//        } catch (Exception e) {
//            // Log the error for debugging
//            e.printStackTrace();
//            // Optionally, handle failures (e.g., retry, alert admin)
//        }
//    }
//}
