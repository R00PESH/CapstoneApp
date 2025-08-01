package training.iqgateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import training.iqgateway.dto.CustomerDTO;

import java.util.Arrays;
import java.util.List;

@Service
public class CustomerServiceUrl {

    @Value("${customer.service.url}")
    private String customerServiceUrl;   // e.g. "http://localhost:9096/customers"

    @Autowired
    private RestTemplate restTemplate;

    // CREATE
    public CustomerDTO createCustomer(CustomerDTO customer) {
        return restTemplate.postForObject(customerServiceUrl, customer, CustomerDTO.class);
    }

    // READ by adharNum (or primary field)
    public CustomerDTO getCustomerByAdharNum(String adharNum) {
        String url = customerServiceUrl + "/" + adharNum;
        return restTemplate.getForObject(url, CustomerDTO.class);
    }

    // UPDATE
    public CustomerDTO updateCustomer(String adharNum, CustomerDTO customer) {
        String url = customerServiceUrl + "/" + adharNum;
        HttpEntity<CustomerDTO> req = new HttpEntity<>(customer);
        ResponseEntity<CustomerDTO> response =
                restTemplate.exchange(url, HttpMethod.PUT, req, CustomerDTO.class);
        return response.getBody();
    }

    // DELETE
    public void deleteCustomer(String adharNum) {
        String url = customerServiceUrl + "/" + adharNum;
        restTemplate.delete(url);
    }

    // GET ALL
    public List<CustomerDTO> getAllCustomers() {
        ResponseEntity<CustomerDTO[]> response = restTemplate.getForEntity(customerServiceUrl, CustomerDTO[].class);
        return Arrays.asList(response.getBody());
    }
}
