package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.entity.CustomerEO;
import training.iqgateway.repo.AdminRepository;
import training.iqgateway.repo.CustomerRepository;
import training.iqgateway.repo.InsuranceTeamRepository;
import training.iqgateway.repo.ProviderRepository;
import training.iqgateway.service.LoginService;

@Service
public class LoginServiceImpl implements LoginService {
	
	@Autowired
	private ProviderRepository providerRepository;
	
	@Autowired
	private InsuranceTeamRepository insuranceTeamRepository;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public Object authenticate(String identifier, String password) {
	    var providerOpt = providerRepository.findByHosIdAndPassword(identifier, password);
	    if (providerOpt.isPresent()) {
	        var provider = providerOpt.get();
	        System.out.println("Provider found: " + provider.getHosId());
	        return provider;
	    } else {
	        System.out.println("No provider found with hosId: " + identifier + " and given password.");
	    }

	    var insuranceTeamOpt = insuranceTeamRepository.findByInsurerIdAndPassword(identifier, password);
	    if (insuranceTeamOpt.isPresent()) {
	        var insuranceTeam = insuranceTeamOpt.get();
	        System.out.println("InsuranceTeam found: " + insuranceTeam.getInsurerId());
	        return insuranceTeam;
	    }

	    var adminOpt = adminRepository.findByEmailAndPassword(identifier, password);
	    if (adminOpt.isPresent()) {
	        var admin = adminOpt.get();
	        System.out.println("Admin found: " + admin.getEmail());
	        return admin;
	    }
	    
	    CustomerEO customer = customerRepository.findByEmailAndPassword(identifier, password);
	    if (customer != null) {
	        System.out.println("Customer found: " + customer.getEmail());
	        return customer;
	    }

	    System.out.println("No user found with identifier: " + identifier);
	    return null;
	}


}
