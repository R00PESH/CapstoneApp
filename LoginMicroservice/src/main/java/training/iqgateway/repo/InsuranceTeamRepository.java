package training.iqgateway.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entity.InsuranceTeamEO;

public interface InsuranceTeamRepository extends MongoRepository<InsuranceTeamEO, String> {
    Optional<InsuranceTeamEO> findByEmail(String email);

    Optional<InsuranceTeamEO> findByInsurerId(String insurerId);

    Optional<InsuranceTeamEO> findByInsurerIdAndPassword(String insurerId, String password);
}












//package training.iqgateway.repo;
//
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import training.iqgateway.entity.InsuranceTeamEO;
//
//public interface InsuranceTeamRepository extends MongoRepository<InsuranceTeamEO, String> {
// 
//		InsuranceTeamEO findByEmail(String email);
//	InsuranceTeamEO findByInsurerId(String insurerId);
//	
//	InsuranceTeamEO findByInsurerIdAndPassword(String insurerId, String password);
//
//}
