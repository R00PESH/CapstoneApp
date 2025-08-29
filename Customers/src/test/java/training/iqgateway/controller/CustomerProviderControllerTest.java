package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import training.admin.iqgateway.dto.ProviderDTO;
import training.iqgateway.service.impl.ProviderClientService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerProviderController.class)
public class CustomerProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderClientService provideClientSer;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getProvidersForCustomer_shouldReturnList() throws Exception {
        ProviderDTO dto = new ProviderDTO();
        dto.setId("p1");
        dto.setSpeciality("Orthopedics");
        dto.setHospitalName("Apollo");
        Mockito.when(provideClientSer.fetchProvidersWithFilters(any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(dto));

        mockMvc.perform(get("/customer-view/providers")
                .param("speciality", "Orthopedics")
                .param("hospitalName", "Apollo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("p1"))
                .andExpect(jsonPath("$[0].speciality").value("Orthopedics"))
                .andExpect(jsonPath("$[0].hospitalName").value("Apollo"));
    }

    @Test
    void getProviderProfile_shouldReturnProvider() throws Exception {
        ProviderDTO dto = new ProviderDTO();
        dto.setId("p2");
        dto.setHospitalName("Medanta");
        Mockito.when(provideClientSer.getProviderById("p2")).thenReturn(dto);

        mockMvc.perform(get("/customer-view/providers/p2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("p2"))
                .andExpect(jsonPath("$.hospitalName").value("Medanta"));
    }

    @Test
    void addReviewToDoctor_shouldAddReview() throws Exception {
        ProviderDTO.ReviewDTO reviewDTO = new ProviderDTO.ReviewDTO("Ravi Shah", "ravi@email.com", 5.0, "Excellent", Instant.now());
        ProviderDTO updatedDto = new ProviderDTO();
        updatedDto.setId("p3");
        updatedDto.setReviews(List.of(reviewDTO));

        Mockito.when(provideClientSer.addReview(eq("p3"), any(ProviderDTO.ReviewDTO.class))).thenReturn(updatedDto);

        mockMvc.perform(post("/customer-view/p3/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("p3"))
                .andExpect(jsonPath("$.reviews[0].customerName").value("Ravi Shah"));
    }
}
