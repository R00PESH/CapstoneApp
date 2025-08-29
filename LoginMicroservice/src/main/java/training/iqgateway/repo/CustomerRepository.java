package training.iqgateway.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entity.CustomerEO;

public interface CustomerRepository extends MongoRepository<CustomerEO, String> {
	
	CustomerEO findByEmail(String email);
	
	CustomerEO findByAdharNumber(String adharNumber);
	
	CustomerEO findByEmailAndPassword(String email, String password);
	
	// Additional methods can be added as needed

}
// Note: The methods in this repository interface are designed to work with the CustomerEO entity.