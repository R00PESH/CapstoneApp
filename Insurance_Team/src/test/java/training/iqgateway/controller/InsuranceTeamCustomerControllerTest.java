package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.iqgateway.dto.CustomerDTO;
import training.iqgateway.dto.CustomerDTO.GeoLocationDTO;
import training.iqgateway.service.impl.CustomerServiceUrl;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InsuranceTeamCustomerController.class)
public class InsuranceTeamCustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerServiceUrl customerServiceUrl;

    @Autowired
    private ObjectMapper objectMapper;

    private CustomerDTO createSampleCustomer() {
        GeoLocationDTO geoLocation = new GeoLocationDTO("Point", List.of(77.209,28.6139));
        return new CustomerDTO(
                "cust123",
                "John Doe",
                "john.doe@example.com",
                "password123",
                Instant.parse("1990-01-01T00:00:00Z"),
                "Male",
                "123456789012",
                "9998887777",
                "123 Main St",
                110001L,
                28.6139,
                77.209,
                "Jane Doe",
                "987654321098",
                List.of("Plan A", "Plan B"),
                "Active",
                geoLocation
        );
    }

    @Test
    void createCustomer_shouldReturnCreatedCustomer() throws Exception {
        CustomerDTO input = createSampleCustomer();
        Mockito.when(customerServiceUrl.createCustomer(any(CustomerDTO.class))).thenReturn(input);

        mockMvc.perform(post("/insurer/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("cust123"))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.adharNumber").value("123456789012"));
    }

    @Test
    void getAllCustomers_shouldReturnList() throws Exception {
        CustomerDTO cust1 = createSampleCustomer();
        CustomerDTO cust2 = createSampleCustomer();
        cust2.setId("cust456");
        cust2.setName("Alice Smith");
        cust2.setAdharNumber("987654321098");

        Mockito.when(customerServiceUrl.getAllCustomers()).thenReturn(List.of(cust1, cust2));

        mockMvc.perform(get("/insurer/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("cust123"))
                .andExpect(jsonPath("$[1].id").value("cust456"));
    }

    @Test
    void getCustomerByAdharNum_shouldReturnCustomer() throws Exception {
        CustomerDTO cust = createSampleCustomer();
        Mockito.when(customerServiceUrl.getCustomerByAdharNum("123456789012")).thenReturn(cust);

        mockMvc.perform(get("/insurer/customers/123456789012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("cust123"))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.adharNumber").value("123456789012"));
    }

    @Test
    void getCustomerByAdharNum_shouldReturnNotFound() throws Exception {
        Mockito.when(customerServiceUrl.getCustomerByAdharNum("nonexistent")).thenReturn(null);

        mockMvc.perform(get("/insurer/customers/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateCustomer_shouldReturnUpdatedCustomer() throws Exception {
        CustomerDTO updated = createSampleCustomer();
        updated.setName("John Updated");
        Mockito.when(customerServiceUrl.updateCustomer(eq("123456789012"), any(CustomerDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/insurer/customers/123456789012")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Updated"));
    }

    @Test
    void updateCustomer_shouldReturnNotFound() throws Exception {
        CustomerDTO updated = createSampleCustomer();
        Mockito.when(customerServiceUrl.updateCustomer(eq("nonexistent"), any(CustomerDTO.class))).thenReturn(null);

        mockMvc.perform(put("/insurer/customers/nonexistent")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCustomer_shouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(customerServiceUrl).deleteCustomer("123456789012");

        mockMvc.perform(delete("/insurer/customers/123456789012"))
                .andExpect(status().isNoContent());

        Mockito.verify(customerServiceUrl).deleteCustomer("123456789012");
    }
}
