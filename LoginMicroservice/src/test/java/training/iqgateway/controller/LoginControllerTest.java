package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

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

import java.time.Instant;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LoginController.class)
public class LoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LoginService loginService;

    @MockBean
    private OtpService otpService;

    @MockBean
    private AdminRepository adminRepository;

    @MockBean
    private InsuranceTeamRepository insuranceTeamRepository;

    @MockBean
    private ProviderRepository providerRepository;

    @MockBean
    private CustomerRepository customerRepository;

    // Helper DTO classes for request bodies

    public static class LoginRequest {
        public String identifier;
        public String password;

        public LoginRequest(String identifier, String password) {
            this.identifier = identifier;
            this.password = password;
        }

        public LoginRequest() {}
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class EmailRequest {
        public String email;
        public EmailRequest(String email) { this.email = email; }
        public EmailRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class OtpValidationRequest {
        public String email;
        public String otp;
        public OtpValidationRequest() {}
        public OtpValidationRequest(String email, String otp) {
            this.email = email;
            this.otp = otp;
        }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
    }

    public static class ResetPasswordRequest {
        public String email;
        public String newPassword;
        public ResetPasswordRequest() {}
        public ResetPasswordRequest(String email, String newPassword) {
            this.email = email;
            this.newPassword = newPassword;
        }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    @Test
    public void testLoginSuccess() throws Exception {
        AdminEO admin = new AdminEO("adminId", "Admin", "admin@example.com", "pass", "ADMIN", null, null);
        Mockito.when(loginService.authenticate("admin@example.com", "pass")).thenReturn(admin);

        LoginRequest req = new LoginRequest("admin@example.com", "pass");

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@example.com"));
    }

    @Test
    public void testLoginFailure() throws Exception {
        Mockito.when(loginService.authenticate(anyString(), anyString())).thenReturn(null);

        LoginRequest req = new LoginRequest("unknown@example.com", "wrong");

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    @Test
    public void testForgotPasswordSuccess() throws Exception {
        Mockito.when(otpService.generateAndSendOtp("user@example.com")).thenReturn(true);

        EmailRequest req = new EmailRequest("user@example.com");

        mockMvc.perform(post("/login/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent to email"));
    }

    @Test
    public void testForgotPasswordFailure() throws Exception {
        Mockito.when(otpService.generateAndSendOtp("wrong@example.com")).thenReturn(false);

        EmailRequest req = new EmailRequest("wrong@example.com");

        mockMvc.perform(post("/login/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email not found"));
    }

    @Test
    public void testValidateOtpSuccess() throws Exception {
        Mockito.when(otpService.validateOtp("user@example.com", "123456")).thenReturn(true);

        OtpValidationRequest req = new OtpValidationRequest("user@example.com", "123456");

        mockMvc.perform(post("/login/validate-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP validated successfully"));
    }

    @Test
    public void testValidateOtpFailure() throws Exception {
        Mockito.when(otpService.validateOtp("user@example.com", "000000")).thenReturn(false);

        OtpValidationRequest req = new OtpValidationRequest("user@example.com", "000000");

        mockMvc.perform(post("/login/validate-otp")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid or expired OTP"));
    }

    @Test
    public void testResetPasswordAsAdminSuccess() throws Exception {
        AdminEO admin = new AdminEO("id1", "AdminUser", "admin@example.com", "oldpass", "ADMIN", null, null);
        Mockito.when(adminRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));
        Mockito.when(adminRepository.save(any(AdminEO.class))).thenReturn(admin);

        ResetPasswordRequest req = new ResetPasswordRequest("admin@example.com", "newpass");

        mockMvc.perform(post("/login/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successfully for Admin"));
    }

    @Test
    public void testResetPasswordAsInsuranceTeamSuccess() throws Exception {
        InsuranceTeamEO team = new InsuranceTeamEO("id2", "insurerId", "TeamMember", "team@example.com", "oldpass", Instant.now(), "active", null, null);
        Mockito.when(adminRepository.findByEmail("team@example.com")).thenReturn(Optional.empty());
        Mockito.when(insuranceTeamRepository.findByEmail("team@example.com")).thenReturn(Optional.of(team));
        Mockito.when(insuranceTeamRepository.save(any(InsuranceTeamEO.class))).thenReturn(team);

        ResetPasswordRequest req = new ResetPasswordRequest("team@example.com", "newpass");

        mockMvc.perform(post("/login/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successfully for Insurance Team member"));
    }

    @Test
    public void testResetPasswordAsProviderSuccess() throws Exception {
        ProviderEO provider = new ProviderEO();
        provider.setId("provId");
        provider.setEmail("prov@example.com");
        provider.setPassword("oldpass");

        Mockito.when(adminRepository.findByEmail("prov@example.com")).thenReturn(Optional.empty());
        Mockito.when(insuranceTeamRepository.findByEmail("prov@example.com")).thenReturn(Optional.empty());
        Mockito.when(providerRepository.findByEmail("prov@example.com")).thenReturn(Optional.of(provider));
        Mockito.when(providerRepository.save(any(ProviderEO.class))).thenReturn(provider);

        ResetPasswordRequest req = new ResetPasswordRequest("prov@example.com", "newpass");

        mockMvc.perform(post("/login/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successfully for Provider"));
    }

    @Test
    public void testResetPasswordAsCustomerSuccess() throws Exception {
        CustomerEO customer = new CustomerEO();
        customer.setId("custId");
        customer.setEmail("cust@example.com");
        customer.setPassword("oldpass");

        Mockito.when(adminRepository.findByEmail("cust@example.com")).thenReturn(Optional.empty());
        Mockito.when(insuranceTeamRepository.findByEmail("cust@example.com")).thenReturn(Optional.empty());
        Mockito.when(providerRepository.findByEmail("cust@example.com")).thenReturn(Optional.empty());
        Mockito.when(customerRepository.findByEmail("cust@example.com")).thenReturn(customer);
        Mockito.when(customerRepository.save(any(CustomerEO.class))).thenReturn(customer);

        ResetPasswordRequest req = new ResetPasswordRequest("cust@example.com", "newpass");

        mockMvc.perform(post("/login/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successfully for Customer"));
    }

    @Test
    public void testResetPasswordEmailNotFound() throws Exception {
        Mockito.when(adminRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        Mockito.when(insuranceTeamRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        Mockito.when(providerRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        Mockito.when(customerRepository.findByEmail("nonexistent@example.com")).thenReturn(null);

        ResetPasswordRequest req = new ResetPasswordRequest("nonexistent@example.com", "newpass");

        mockMvc.perform(post("/login/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email not found"));
    }
}
