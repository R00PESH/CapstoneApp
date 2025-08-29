package training.admin.iqgateway.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import training.admin.iqgateway.dto.ProviderDTO;
import training.admin.iqgateway.dto.DoctorDTO.ReviewDTO;
import training.admin.iqgateway.dto.event.HospitalCreatedEvent;

@Service
public class ProviderServiceUrl {
	
	@Value("${provider.service.url}")
	private String providerServiceUrl;
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private EmailService emailService;
	
//	// CREATE
//    public ProviderDTO createProvider(ProviderDTO provider) {
//        ProviderDTO createdProvider =  restTemplate.postForObject(
//            providerServiceUrl, provider, ProviderDTO.class
//        );
//        
//     // If createdProvider is not null and email is present, send notification
//        if (createdProvider != null && createdProvider.getEmail() != null && !createdProvider.getEmail().isEmpty()) {
//            // Assuming ProviderDTO has getName() or appropriate method for recipient name
//        	emailService.sendHospitalRegistrationEmail(
//        		    createdProvider.getEmail(),
//        		    createdProvider.getHospitalName(),
//        		    createdProvider.getInsurancePlans(),
//        		    createdProvider.getHosId()
//        		);
//        }
//
//        return createdProvider;
//    }
	
	
	
	@Autowired
    private AmqpTemplate amqpTemplate;

    @Value("${rabbitmq.exchange}")
    private String rabbitExchange;

    @Value("${rabbitmq.routingkey}")
    private String rabbitRoutingKey;

    public ProviderDTO createProvider(ProviderDTO provider) {
        ProviderDTO createdProvider =
                restTemplate.postForObject(providerServiceUrl, provider, ProviderDTO.class);

        if (createdProvider != null && createdProvider.getEmail() != null && !createdProvider.getEmail().isEmpty()) {
            emailService.sendHospitalRegistrationEmail(
                    createdProvider.getEmail(),
                    createdProvider.getHospitalName(),
                    createdProvider.getInsurancePlans(),
                    createdProvider.getHosId()
            );
        }

        if (createdProvider != null) {
            HospitalCreatedEvent event = new HospitalCreatedEvent();
            event.setHosId(createdProvider.getHosId());
            event.setHospitalName(createdProvider.getHospitalName());
            event.setInsurancePlans(createdProvider.getInsurancePlans());
            event.setLocation(createdProvider.getLocation());
            event.setZipcode(createdProvider.getZipcode());
            event.setLat(createdProvider.getLat());
            event.setLon(createdProvider.getLon());

            amqpTemplate.convertAndSend(rabbitExchange, rabbitRoutingKey, event);
        }

        return createdProvider;
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
