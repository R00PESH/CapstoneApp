package training.iqgateway.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.dto.EmailRequest;
import training.iqgateway.dto.LoginRequest;
import training.iqgateway.dto.OtpValidationRequest;
import training.iqgateway.dto.ResetPasswordRequest;
import training.iqgateway.entity.AdminEO;
import training.iqgateway.entity.CustomerEO;
import training.iqgateway.entity.InsuranceTeamEO;
import training.iqgateway.entity.ProviderEO;
import training.iqgateway.repo.AdminRepository;
import training.iqgateway.repo.CustomerRepository;
import training.iqgateway.repo.InsuranceTeamRepository;
import training.iqgateway.repo.ProviderRepository;
import training.iqgateway.service.LoginService;
import training.iqgateway.service.impl.OtpService;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private InsuranceTeamRepository insuranceTeamRepository;

    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private CustomerRepository customerRepository; // Assuming this is also needed

    /** DTO for Login Request JSON */
//    public static class LoginRequest {
//        private String identifier; // hosId / insurerId / email
//        private String password;
//
//        public String getIdentifier() { return identifier; }
//        public void setIdentifier(String identifier) { this.identifier = identifier; }
//
//        public String getPassword() { return password; }
//        public void setPassword(String password) { this.password = password; }
//    }
//
//    /** DTO for requests that only need email (forgot-password) */
//    public static class EmailRequest {
//        private String email;
//
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//    }
//
//    /** DTO for OTP validation request */
//    public static class OtpValidationRequest {
//        private String email;
//        private String otp;
//
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//
//        public String getOtp() { return otp; }
//        public void setOtp(String otp) { this.otp = otp; }
//    }
//
//    /** DTO for reset password request */
//    public static class ResetPasswordRequest {
//        private String email;
//        private String newPassword;
//
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//
//        public String getNewPassword() { return newPassword; }
//        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
//    }

    /** Login endpoint. Expects JSON body:
     * {
     *   "identifier": "hosId/insurerId/email",
     *   "password": "userPassword"
     * }
     */
    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Object user = loginService.authenticate(loginRequest.getIdentifier(), loginRequest.getPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        return ResponseEntity.ok(user);
    }

    /** Forgot password endpoint - generates and sends OTP to email.
     * JSON body: { "email": "user@example.com" }
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailRequest emailRequest) {
        boolean otpSent = otpService.generateAndSendOtp(emailRequest.getEmail());
        if (!otpSent) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found");
        }
        return ResponseEntity.ok("OTP sent to email");
    }

    /** Validate OTP endpoint.
     * JSON body: { "email": "user@example.com", "otp": "123456" }
     */
    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestBody OtpValidationRequest otpValidationRequest) {
        boolean valid = otpService.validateOtp(otpValidationRequest.getEmail(), otpValidationRequest.getOtp());
        if (!valid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
        }
        return ResponseEntity.ok("OTP validated successfully");
    }

    /** Reset password endpoint.
     * JSON body: { "email": "user@example.com", "newPassword": "yourNewStrongPassword" }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String email = resetPasswordRequest.getEmail();
        String newPassword = resetPasswordRequest.getNewPassword();

        Optional<AdminEO> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            AdminEO admin = adminOpt.get();
            admin.setPassword(newPassword);
            admin.setOtp(null);
            admin.setOtpExpiry(null);
            adminRepository.save(admin);
            return ResponseEntity.ok("Password reset successfully for Admin");
        }

        Optional<InsuranceTeamEO> insuranceTeamOpt = insuranceTeamRepository.findByEmail(email);
        if (insuranceTeamOpt.isPresent()) {
            InsuranceTeamEO insuranceTeam = insuranceTeamOpt.get();
            insuranceTeam.setPassword(newPassword);
            insuranceTeam.setOtp(null);
            insuranceTeam.setOtpExpiry(null);
            insuranceTeamRepository.save(insuranceTeam);
            return ResponseEntity.ok("Password reset successfully for Insurance Team member");
        }

        Optional<ProviderEO> providerOpt = providerRepository.findByEmail(email);
        if (providerOpt.isPresent()) {
            ProviderEO provider = providerOpt.get();
            provider.setPassword(newPassword);
            provider.setOtp(null);
            provider.setOtpExpiry(null);
            providerRepository.save(provider);
            return ResponseEntity.ok("Password reset successfully for Provider");
        }
        
        
        // Assuming CustomerEO is also part of the system
        CustomerEO customerOpt = customerRepository.findByEmail(email);
        if (customerOpt!= null) {
        	CustomerEO customer = customerOpt;
			customer.setPassword(newPassword);
			customer.setOtp(null);
			customer.setOtpExpiry(null);
			customerRepository.save(customer);
			return ResponseEntity.ok("Password reset successfully for Customer");
		}

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found");
    }
}
