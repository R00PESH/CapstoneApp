package training.iqgateway.service.impl;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import training.iqgateway.model.ProviderEO;
import training.iqgateway.model.ProviderEO.Review;
import training.iqgateway.repo.ProviderRepository;
import training.iqgateway.service.ProviderService;

@Service
public class ProviderServiceImpl implements ProviderService {
    private static final Logger logger = LoggerFactory.getLogger(ProviderServiceImpl.class);
	
	@Autowired
	private ProviderRepository provideRepo;
	
	@Autowired
	private MongoTemplate mongoTem;

	@Override
	public ProviderEO createProvider(ProviderEO provider) {
		if(provider.getLat()!=0 && provider.getLon()!=0) {
			provider.setGeoLocation(new GeoJsonPoint(provider.getLon(),provider.getLat()));
		}
		provider.setRating(0d);
		return provideRepo.save(provider);
	}

	@Override
	public ProviderEO getProviderById(String docId) {
		// TODO Auto-generated method stub
		return provideRepo.findByHosId(docId);
	}

	@Override
	public List<ProviderEO> getProviderByName(String name) {
		// TODO Auto-generated method stub
		return provideRepo.findByHospitalName(name);
	}

	@Override
	public List<ProviderEO> getAllProviders() {
		// TODO Auto-generated method stub
		return provideRepo.findAll();
	}

//	@Override
	public ProviderEO updateProvider(String hosId, ProviderEO changes) {
	    ProviderEO existing = getProviderById(hosId);
	    if (existing == null) return null;

	    // Only update provided fields
	    if (changes.getSpeciality() != null) existing.setSpeciality(changes.getSpeciality());
	    if (changes.getLocation() != null) existing.setLocation(changes.getLocation());
	    if (changes.getHospitalName() != null) existing.setHospitalName(changes.getHospitalName());
	    if (changes.getInsurancePlans() != null && !changes.getInsurancePlans().isEmpty())
	        existing.setInsurancePlans(changes.getInsurancePlans());
	    if (changes.getActiveStatus() != null) existing.setActiveStatus(changes.getActiveStatus());
	    if (changes.getLat() != 0) existing.setLat(changes.getLat());
	    if (changes.getLon() != 0) existing.setLon(changes.getLon());
	    if (changes.getGeoLocation() != null) existing.setGeoLocation(changes.getGeoLocation());
	    if (changes.getDocId() != null && !changes.getDocId().isEmpty())
	        existing.setDocId(changes.getDocId());
	    if (changes.getZipcode() != 0) existing.setZipcode(changes.getZipcode());
	    if (changes.getReviews() != null && !changes.getReviews().isEmpty())
	        existing.setReviews(changes.getReviews());
	    // You can add more fields as needed

	    return provideRepo.save(existing);
	}

	@Override
	public void deleteProvider(String hosId) {
		provideRepo.deleteByHosId(hosId);
	}

	@Override
	public List<ProviderEO> filterProviders(
	        Double lat, Double lon, Double distanceKm,
	        Long zipcode,
	        Double minRating,
	        List<String> insurancePlans,
	        String hospitalName,
	        String location,
	        String speciality
	) {
	    List<Criteria> criteriaList = new ArrayList<>();

	    if (lat != null && lon != null && distanceKm != null) {
	        Point point = new Point(lon, lat);
	        Distance distance = new Distance(distanceKm, Metrics.KILOMETERS);
	        criteriaList.add(Criteria.where("geoLocation").nearSphere(point).maxDistance(distance.getNormalizedValue()));
	    }
	    if (zipcode != null) criteriaList.add(Criteria.where("zipcode").is(zipcode));
	    if (location != null) criteriaList.add(Criteria.where("location").is(location));
	    if (minRating != null) criteriaList.add(Criteria.where("rating").gte(minRating));
	    if (hospitalName != null) criteriaList.add(Criteria.where("Hospital_name").is(hospitalName));
	    if (insurancePlans != null && !insurancePlans.isEmpty())
	        criteriaList.add(Criteria.where("insurance_Plans").in(insurancePlans));
	    if (speciality != null) criteriaList.add(Criteria.where("speciality").is(speciality));
	    Query query = new Query();
	    if (!criteriaList.isEmpty()) query.addCriteria(new Criteria().andOperator(criteriaList));
	    logger.info("MongoDB Query: {}", query);
        logger.info("Filter parameters - lat: {}, lon: {}, distanceKm: {}, zipcode: {}, minRating: {}, insurancePlans: {}, speciality: {}, location: {}, hospitalName: {}",
                lat, lon, distanceKm, zipcode, minRating, insurancePlans, speciality, location, hospitalName);
        List<ProviderEO> result = mongoTem.find(query, ProviderEO.class);
        logger.info("Result count: {}", result.size());
	    return mongoTem.find(query, ProviderEO.class);
	}


	

	@Override
	public ProviderEO addReview(String providerId, Review review) {
		ProviderEO provider = getProviderById(providerId);
        if (provider == null) return null;
        if (provider.getReviews() == null) provider.setReviews(new ArrayList<>());
        provider.getReviews().add(review);
        provider.setRating(calcReviewAverage(provider.getReviews()));
        return provideRepo.save(provider);
    }
	
	private double calcReviewAverage(List<ProviderEO.Review> reviews) {
        if (reviews == null || reviews.isEmpty()) return 0d;
        double sum = 0;
        for (ProviderEO.Review r : reviews) sum += r.getRating();
        return Math.round((sum / reviews.size()) * 10.0) / 10.0;
    }

	@Override
	public List<ProviderEO> getProviderByHospital(String hospitalName) {
		return provideRepo.findByHospitalName(hospitalName);
	}

}