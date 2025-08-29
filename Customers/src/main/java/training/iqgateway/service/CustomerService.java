package training.iqgateway.service;

import java.util.List;

import training.iqgateway.model.CustomerEO;

public interface CustomerService {
	
	CustomerEO createCustomer(CustomerEO customer);
	
	CustomerEO getCustomerByAdharNum(String adharNum);
	
	CustomerEO getCustomerByEmail(String email);
	
	CustomerEO updateCustomer(String adharNum,CustomerEO customer);
	
	List<CustomerEO> getAllCustomers();
	
	void deleteCustomer(String id);

}
