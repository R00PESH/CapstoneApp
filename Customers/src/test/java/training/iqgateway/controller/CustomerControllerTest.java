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
import training.iqgateway.model.CustomerEO;
import training.iqgateway.service.CustomerService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
public class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerSer;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createCustomer_shouldCreateCustomer() throws Exception {
        CustomerDTO dto = new CustomerDTO();
        dto.setId("1");
        dto.setName("Alice Sharma");
        dto.setEmail("alice@email.com");

        CustomerEO eo = new CustomerEO();
        eo.setId("1");
        eo.setName("Alice Sharma");
        eo.setEmail("alice@email.com");

        Mockito.when(customerSer.createCustomer(any(CustomerEO.class))).thenReturn(eo);

        mockMvc.perform(post("/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Alice Sharma"))
                .andExpect(jsonPath("$.email").value("alice@email.com"));
    }

    @Test
    void getCustomer_shouldReturnCustomer() throws Exception {
        // Here, 'id' is mapped to adharNum for getCustomerByAdharNum
        CustomerEO eo = new CustomerEO();
        eo.setId("2");
        eo.setName("Bob Singh");
        eo.setAdharNumber("123456789012");
        eo.setEmail("bob@email.com");
        Mockito.when(customerSer.getCustomerByAdharNum("123456789012")).thenReturn(eo);

        mockMvc.perform(get("/customers/123456789012"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("2"))
                .andExpect(jsonPath("$.name").value("Bob Singh"))
                .andExpect(jsonPath("$.email").value("bob@email.com"));
    }

    @Test
    void getCustomerByEmail_shouldReturnCustomer() throws Exception {
        CustomerEO eo = new CustomerEO();
        eo.setId("3");
        eo.setName("Charlie Patel");
        eo.setEmail("charlie@email.com");
        Mockito.when(customerSer.getCustomerByEmail("charlie@email.com")).thenReturn(eo);

        mockMvc.perform(get("/customers/email/charlie@email.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("3"))
                .andExpect(jsonPath("$.name").value("Charlie Patel"))
                .andExpect(jsonPath("$.email").value("charlie@email.com"));
    }

    @Test
    void getAllCustomers_shouldReturnListOfCustomers() throws Exception {
        CustomerEO eo1 = new CustomerEO();
        eo1.setId("4");
        eo1.setName("Deepa Bansal");
        eo1.setEmail("deepa@email.com");
        Mockito.when(customerSer.getAllCustomers()).thenReturn(Collections.singletonList(eo1));

        mockMvc.perform(get("/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("4"))
                .andExpect(jsonPath("$[0].name").value("Deepa Bansal"))
                .andExpect(jsonPath("$[0].email").value("deepa@email.com"));
    }

    @Test
    void updateCustomer_shouldUpdateCustomer() throws Exception {
        CustomerDTO dto = new CustomerDTO();
        dto.setId("5");
        dto.setName("Esha Reddy");
        dto.setEmail("esha@email.com");

        CustomerEO eo = new CustomerEO();
        eo.setId("5");
        eo.setName("Esha Reddy");
        eo.setEmail("esha@email.com");

        Mockito.when(customerSer.updateCustomer(eq("5"), any(CustomerEO.class))).thenReturn(eo);

        mockMvc.perform(put("/customers/5")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("5"))
                .andExpect(jsonPath("$.name").value("Esha Reddy"))
                .andExpect(jsonPath("$.email").value("esha@email.com"));
    }

    @Test
    void deleteCustomer_shouldDeleteCustomer() throws Exception {
        Mockito.doNothing().when(customerSer).deleteCustomer("6");

        mockMvc.perform(delete("/customers/6"))
                .andExpect(status().isOk());
    }
}
