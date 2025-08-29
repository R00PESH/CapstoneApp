package training.iqgateway.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import training.iqgateway.entity.AdminEO;
import training.iqgateway.entity.CustomerEO;
import training.iqgateway.entity.InsuranceTeamEO;
import training.iqgateway.entity.ProviderEO;
import training.iqgateway.repo.AdminRepository;
import training.iqgateway.repo.CustomerRepository;
import training.iqgateway.repo.InsuranceTeamRepository;
import training.iqgateway.repo.ProviderRepository;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private InsuranceTeamRepository insuranceTeamRepository;

    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    public boolean generateAndSendOtp(String email) {
        Object user = findUserByEmail(email);
        if (user == null) {
            return false; // No such email
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000)); // 6-digit OTP
        Instant expiry = Instant.now().plus(10, ChronoUnit.MINUTES); // 10 minutes from now

        if (user instanceof AdminEO) {
            AdminEO admin = (AdminEO) user;
            admin.setOtp(otp);
            admin.setOtpExpiry(expiry);
            adminRepository.save(admin);
        } else if (user instanceof InsuranceTeamEO) {
            InsuranceTeamEO insuranceTeam = (InsuranceTeamEO) user;
            insuranceTeam.setOtp(otp);
            insuranceTeam.setOtpExpiry(expiry);
            insuranceTeamRepository.save(insuranceTeam);
        } else if (user instanceof ProviderEO) {
            ProviderEO provider = (ProviderEO) user;
            provider.setOtp(otp);
            provider.setOtpExpiry(expiry);
            providerRepository.save(provider);
        } else if (user instanceof CustomerEO) {
			CustomerEO customer = (CustomerEO) user;
			customer.setOtp(otp);
			customer.setOtpExpiry(expiry);
			customerRepository.save(customer);
		}

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp + ". It is valid for 10 minutes.");
        mailSender.send(message);

        return true;
    }

    public boolean validateOtp(String email, String otp) {
        Object user = findUserByEmail(email);
        if (user == null) {
            return false;
        }

        String savedOtp = null;
        Instant otpExpiry = null;

        if (user instanceof AdminEO) {
            AdminEO admin = (AdminEO) user;
            savedOtp = admin.getOtp();
            otpExpiry = admin.getOtpExpiry();
        } else if (user instanceof InsuranceTeamEO) {
            InsuranceTeamEO insuranceTeam = (InsuranceTeamEO) user;
            savedOtp = insuranceTeam.getOtp();
            otpExpiry = insuranceTeam.getOtpExpiry();
        } else if (user instanceof ProviderEO) {
            ProviderEO provider = (ProviderEO) user;
            savedOtp = provider.getOtp();
            otpExpiry = provider.getOtpExpiry();
        } else if (user instanceof CustomerEO) {
        	CustomerEO customer = (CustomerEO) user;
			savedOtp = customer.getOtp();
			otpExpiry = customer.getOtpExpiry();
        }

        if (savedOtp != null && otpExpiry != null 
            && otpExpiry.isAfter(Instant.now()) 
            && savedOtp.equals(otp)) {
            
            clearOtp(user);
            return true;
        }

        return false;
    }

    private Object findUserByEmail(String email) {
        Optional<AdminEO> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            return adminOpt.get();
        }

        Optional<InsuranceTeamEO> insuranceTeamOpt = insuranceTeamRepository.findByEmail(email);
        if (insuranceTeamOpt.isPresent()) {
            return insuranceTeamOpt.get();
        }

        Optional<ProviderEO> providerOpt = providerRepository.findByEmail(email);
        if (providerOpt.isPresent()) {
            return providerOpt.get();
        }
        
        CustomerEO customerOpt = customerRepository.findByEmail(email);
        if (customerOpt != null) {
			return customerOpt;
		}

        return null;
    }


    private void clearOtp(Object user) {
        if (user instanceof AdminEO) {
            AdminEO admin = (AdminEO) user;
            admin.setOtp(null);
            admin.setOtpExpiry(null);
            adminRepository.save(admin);
        } else if (user instanceof InsuranceTeamEO) {
            InsuranceTeamEO insuranceTeam = (InsuranceTeamEO) user;
            insuranceTeam.setOtp(null);
            insuranceTeam.setOtpExpiry(null);
            insuranceTeamRepository.save(insuranceTeam);
        } else if (user instanceof ProviderEO) {
            ProviderEO provider = (ProviderEO) user;
            provider.setOtp(null);
            provider.setOtpExpiry(null);
            providerRepository.save(provider);
        } else if (user instanceof CustomerEO) {
			CustomerEO customer = (CustomerEO) user;
			customer.setOtp(null);
			customer.setOtpExpiry(null);
			customerRepository.save(customer);
        }
    }
}
