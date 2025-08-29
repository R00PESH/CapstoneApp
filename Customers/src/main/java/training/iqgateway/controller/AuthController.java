//package training.iqgateway.controller;
//
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import training.iqgateway.model.CustomerEO;
//import training.iqgateway.service.CustomerService;
//import training.iqgateway.service.impl.OtpService;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//    @Autowired
//    private CustomerService customerService;
//
//    @Autowired
//    private OtpService otpService;
//
//    @PostMapping("/forgot-password")
//    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) {
//        String email = payload.get("email");
//        if (email == null || email.isEmpty()) {
//            return ResponseEntity.badRequest().body("Email is required");
//        }
//
//        CustomerEO customer = customerService.getCustomerByEmail(email);
//        if (customer == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not registered");
//        }
//
//        otpService.generateOtp(email);
//        return ResponseEntity.ok("OTP sent to your email");
//    }
//
//    @PostMapping("/reset-password")
//    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
//        if (request.getEmail() == null || request.getOtp() == null || request.getNewPassword() == null) {
//            return ResponseEntity.badRequest().body("Email, OTP, and new password are required");
//        }
//
//        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
//        }
//
//        CustomerEO customer = customerService.getCustomerByEmail(request.getEmail());
//        if (customer == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not registered");
//        }
//
//        // Ideally hash the password before storing, e.g., BCrypt
//        customer.setPassword(request.getNewPassword());
//        customerService.updateCustomer(customer.getAdharNumber(), customer);
//
//        return ResponseEntity.ok("Password reset successful");
//    }
//
//    public static class ResetPasswordRequest {
//        private String email;
//        private String otp;
//        private String newPassword;
//		public ResetPasswordRequest() {
//			super();
//			// TODO Auto-generated constructor stub
//		}
//		public String getEmail() {
//			return email;
//		}
//		public void setEmail(String email) {
//			this.email = email;
//		}
//		public String getOtp() {
//			return otp;
//		}
//		public void setOtp(String otp) {
//			this.otp = otp;
//		}
//		public String getNewPassword() {
//			return newPassword;
//		}
//		public void setNewPassword(String newPassword) {
//			this.newPassword = newPassword;
//		}
//        
//        
//
//        // getters and setters
//    }
//}
//
