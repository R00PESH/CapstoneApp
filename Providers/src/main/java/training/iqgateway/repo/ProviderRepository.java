package training.iqgateway.repo;

import java.util.List;

import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.mongodb.client.model.geojson.Point;

import training.iqgateway.model.ProviderEO;

public interface ProviderRepository extends MongoRepository<ProviderEO, String> {
	
	List<ProviderEO> findByGeoLocationNear(Point point,Distance distance);

	List<ProviderEO> findBySpeciality(String speciality);
	 
	ProviderEO findByHosId(String hosId);

	List<ProviderEO> findByInsurancePlansIn(List<String> insurancePlans);
	
	List<ProviderEO> findByActiveStatus(String activeStatus);
	
	
	List<ProviderEO> findByRatingGreaterThan(double minrating);
	
	List<ProviderEO> findByHospitalName(String hospitalName);
	
	List<ProviderEO> findByZipcode(long zipcode);
	
	ProviderEO  findByDocId(String docId);
	
	void deleteByHosId(String hosId);
	
	List<ProviderEO> findByLocationAndZipcode(String location, long zipcode);
	
	
}