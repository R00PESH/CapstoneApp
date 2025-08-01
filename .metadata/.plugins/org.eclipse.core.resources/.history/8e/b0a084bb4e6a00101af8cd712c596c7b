package training.iqgateway.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import training.iqgateway.dto.DoctorDTO.ReviewDTO;
import training.iqgateway.dto.ProviderDTO;

@Service
public class ProviderServiceUrl {
	
	@Value("${provider.service.url}")
	private String providerServiceUrl;
	
	@Autowired
	private RestTemplate restTemplate;
	
	// CREATE
    public ProviderDTO createProvider(ProviderDTO provider) {
        return restTemplate.postForObject(
            providerServiceUrl, provider, ProviderDTO.class
        );
    }

    // READ by id
    public ProviderDTO getProviderById(String id) {
        String url = providerServiceUrl + "/" + id;
        return restTemplate.getForObject(url, ProviderDTO.class);
    }

    // READ all
    public List<ProviderDTO> getAllProviders() {
        ResponseEntity<ProviderDTO[]> response =
                restTemplate.getForEntity(providerServiceUrl, ProviderDTO[].class);
        return Arrays.asList(response.getBody());
    }

    // READ by hospital name
    public List<ProviderDTO> getProviderByHospital(String hospitalName) {
        String url = providerServiceUrl + "/hospital/" + hospitalName;
        ResponseEntity<ProviderDTO[]> response =
                restTemplate.getForEntity(url, ProviderDTO[].class);
        return Arrays.asList(response.getBody());
    }

    // UPDATE
    public ProviderDTO updateProvider(String id, ProviderDTO provider) {
        String url = providerServiceUrl + "/" + id;
        HttpEntity<ProviderDTO> req = new HttpEntity<>(provider);
        ResponseEntity<ProviderDTO> response =
                restTemplate.exchange(url, HttpMethod.PUT, req, ProviderDTO.class);
        return response.getBody();
    }

    // DELETE
    public void deleteProvider(String id) {
        String url = providerServiceUrl + "/" + id;
        restTemplate.delete(url);
    }



    // ADD REVIEW
    public ProviderDTO addReview(String providerId, ReviewDTO review) {
        String url = providerServiceUrl + "/" + providerId + "/reviews";
        return restTemplate.postForObject(url, review, ProviderDTO.class);
    }

}
