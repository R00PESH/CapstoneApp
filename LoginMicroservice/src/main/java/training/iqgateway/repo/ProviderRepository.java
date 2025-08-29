package training.iqgateway.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.entity.ProviderEO;

public interface ProviderRepository extends MongoRepository<ProviderEO, String> {
    Optional<ProviderEO> findByEmail(String email);

    Optional<ProviderEO> findByHosId(String hosId);

    Optional<ProviderEO> findByHosIdAndPassword(String hosId, String password);
}













//package training.iqgateway.repo;
//
//import org.springframework.data.mongodb.repository.MongoRepository;
//
//import training.iqgateway.entity.ProviderEO;
//
//public interface ProviderRepository extends MongoRepository<ProviderEO, String> {
//	
//		ProviderEO findByEmail(String email);
////	ProviderEO findById(String id);
//	ProviderEO findByHosId(String hosId);
//	
//	ProviderEO findByHosIdAndPassword(String hosId, String password);
//
//
//}
