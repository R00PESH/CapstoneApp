package training.iqgateway.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.model.CustomerEO;
import training.iqgateway.repo.CustomerRepository;
import training.iqgateway.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerRepository customerRepo;

	@Override
	public CustomerEO createCustomer(CustomerEO customer) {
		// TODO Auto-generated method stub
		return customerRepo.save(customer);
	}

	@Override
	public CustomerEO getCustomerByAdharNum(String adharNum) {
		// TODO Auto-generated method stub
		return customerRepo.findByAdharNumber(adharNum);
	}

	@Override
	public CustomerEO updateCustomer(String adharNum, CustomerEO customer) {
	    CustomerEO existing = customerRepo.findByAdharNumber(adharNum); // or findById, depending on your key!
	    if (existing == null) return null;

	    // Now, update the fields (do NOT set id; only update mutable data)
	    existing.setName(customer.getName());
	    existing.setEmail(customer.getEmail());
	    existing.setPassword(customer.getPassword());
	    existing.setDateOfBirth(customer.getDateOfBirth());
	    existing.setGender(customer.getGender());
	    existing.setContactNumber(customer.getContactNumber());
	    existing.setAddress(customer.getAddress());
	    existing.setZipcode(customer.getZipcode());
	    existing.setLat(customer.getLat());
	    existing.setLon(customer.getLon());
	    existing.setNominee(customer.getNominee());
	    existing.setNomineeAdharNumber(customer.getNomineeAdharNumber());
	    existing.setInsurancePlans(customer.getInsurancePlans());
	    existing.setStatus(customer.getStatus());
	    existing.setGeoLocation(customer.getGeoLocation());

	    // Save and return updated entity
	    return customerRepo.save(existing);
	}

	@Override
	public List<CustomerEO> getAllCustomers() {
		// TODO Auto-generated method stub
		return customerRepo.findAll();
	}

	@Override
	public void deleteCustomer(String adharnum) {
		// TODO Auto-generated method stub
		customerRepo.deleteByAdharNumber(adharnum);

	}

	@Override
	public CustomerEO getCustomerByEmail(String email) {
		// TODO Auto-generated method stub
		return customerRepo.findByEmail(email);
	}

}
