package training.iqgateway.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import training.iqgateway.dto.DoctorDTO;
import training.iqgateway.dto.ProviderDTO;

@Service
public class ProviderClientService {
      
	@Value("${provider.service.url}")
    private String providerServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    // Fetch all providers or apply optional filters via query params
    public List<ProviderDTO> fetchProvidersWithFilters(
        String speciality,
        Double rating,
        String hospitalName,
        String location,
        Long zipcode,
        Double lat,
        Double lon,
        Double distanceKm,
        String insurancePlan
    ) {
        UriComponentsBuilder builder = UriComponentsBuilder
            .fromHttpUrl(providerServiceUrl + "/filter");
        if (speciality != null) builder.queryParam("speciality", speciality);
        if (rating != null) builder.queryParam("minRating", rating);
        if(hospitalName != null) builder.queryParam("Hospital_Name", hospitalName);
        if (location != null) builder.queryParam("location", location);
        if (zipcode != null) builder.queryParam("zipcode", zipcode);
        if (lat != null) builder.queryParam("lat", lat);
        if (lon != null) builder.queryParam("lon", lon);
        if (distanceKm != null) builder.queryParam("distanceKm", distanceKm);
        if (insurancePlan != null) builder.queryParam("insurancePlans", insurancePlan);

        ProviderDTO[] arr = restTemplate.getForObject(
            builder.toUriString(), ProviderDTO[].class);
        return Arrays.asList(arr);
    }

    // Fetch one provider by ID
    public ProviderDTO getProviderById(String providerId) {
        String url = providerServiceUrl + "/" + providerId;
        return restTemplate.getForObject(url, ProviderDTO.class);
    }
    
    public ProviderDTO getProviderByhospitalName(String hospitalName) {
		String url = providerServiceUrl + "/hospital/" + hospitalName;
		return restTemplate.getForObject(url, ProviderDTO.class);
    }
    
    public ProviderDTO addReview(String proId, ProviderDTO.ReviewDTO reviewDTO) {
	    String url = UriComponentsBuilder
	        .fromHttpUrl(providerServiceUrl + "/" + proId + "/reviews")
	        .toUriString();
	    return restTemplate.postForObject(url, reviewDTO, ProviderDTO.class);
	}
}
