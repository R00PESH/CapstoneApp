package training.iqgateway.service;

import java.util.List;


import training.iqgateway.model.ProviderEO;

public interface ProviderService {
	
	ProviderEO createProvider(ProviderEO provider);
	
	ProviderEO getProviderById(String hosId);
	
	List<ProviderEO> getProviderByName(String name);
	
	List<ProviderEO> getAllProviders();
	
	List<ProviderEO> getProviderByHospital(String Hospital_name);
	
	ProviderEO updateProvider(String docId,ProviderEO provider);
	
    void deleteProvider(String hosId);
    
    
    List<ProviderEO> filterProviders(
    	    Double lat, Double lon, Double distanceKm,
    	    Long zipcode,
    	    Double minRating,
    	    List<String> insurancePlans,
    	    String speciality,
    	    String location,
    	    String hospitalName
    	);


    ProviderEO addReview(String providerId, ProviderEO.Review review);

	
	

}
