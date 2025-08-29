package training.iqgateway.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entity.AdminEO;

public interface AdminRepository extends MongoRepository<AdminEO, String> {
    Optional<AdminEO> findByEmail(String email);

    // Remove unnecessary findById since it exists via MongoRepository

    Optional<AdminEO> findByEmailAndPassword(String email, String password);
}






//package training.iqgateway.repo;
//
//import java.util.Optional;
//
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import training.iqgateway.entity.AdminEO;
//import training.iqgateway.entity.InsuranceTeamEO;
//
//public interface AdminRepository extends MongoRepository<AdminEO, String> {
//	
//	AdminEO findByEmail(String email);
//	
//	Optional<AdminEO> findById(String id);
//
//	
//	AdminEO findByEmailAndPassword(String email, String password);
//
//
//}
