package training.iqgateway.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.model.CustomerEO;
import java.util.List;


public interface CustomerRepository extends MongoRepository<CustomerEO, String> {
	
	CustomerEO findByAdharNumber(String adharNumber);
	
	void deleteByAdharNumber(String adharNumber);

}
