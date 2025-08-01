package training.iqgateway.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.model.InsurancePlansEO;
import java.util.List;


public interface InsurancePlansRepository extends MongoRepository<InsurancePlansEO, String> {

	InsurancePlansEO  findByTitle(String title);
}
