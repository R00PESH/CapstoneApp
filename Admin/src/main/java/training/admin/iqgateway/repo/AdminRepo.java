package training.admin.iqgateway.repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.admin.iqgateway.model.AdminEO;
import java.util.List;


public interface AdminRepo extends MongoRepository<AdminEO, String> {
	
	AdminEO findByEmail(String email);
	
	AdminEO  findBy_id(String _id);

}
