package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import training.iqgateway.dto.ProviderDTO;
import training.iqgateway.dto.DoctorDTO;
import training.iqgateway.model.ProviderEO;
import training.iqgateway.model.ProviderEO.Review;
import training.iqgateway.service.ProviderService;
import training.iqgateway.service.impl.DoctorServiceUrl;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProviderController.class)
public class ProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderService provideSer;

    @MockBean
    private DoctorServiceUrl doctorServiceUrl;

    @Autowired
    private ObjectMapper objectMapper;

    // --- GET /providers/{id}
    @Test
    void getProvider_shouldReturnProvider() throws Exception {
        ProviderEO providerEO = new ProviderEO();
        providerEO.setId("1");
        providerEO.setHosId("H101");
        providerEO.setSpeciality("Cardiology");
        Mockito.when(provideSer.getProviderById("1")).thenReturn(providerEO);

        mockMvc.perform(get("/providers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.hosId").value("H101"))
                .andExpect(jsonPath("$.speciality").value("Cardiology"));
    }

    // --- GET /providers
    @Test
    void getAllProviders_shouldReturnList() throws Exception {
        ProviderEO providerEO = new ProviderEO();
        providerEO.setId("1");
        providerEO.setHosId("H101");
        Mockito.when(provideSer.getAllProviders()).thenReturn(Collections.singletonList(providerEO));

        mockMvc.perform(get("/providers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].hosId").value("H101"));
    }

    // --- POST /providers
    @Test
    void createProvider_shouldCreateProvider() throws Exception {
        ProviderDTO dto = new ProviderDTO();
        dto.setId("2");
        dto.setHosId("H202");
        dto.setSpeciality("Neurology");
        ProviderEO eo = new ProviderEO();
        eo.setId("2");
        eo.setHosId("H202");
        eo.setSpeciality("Neurology");

        Mockito.when(provideSer.createProvider(any(ProviderEO.class))).thenReturn(eo);

        mockMvc.perform(post("/providers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("2"))
                .andExpect(jsonPath("$.speciality").value("Neurology"));
    }

    // --- PUT /providers/{id}
    @Test
    void updateProvider_shouldUpdateProvider() throws Exception {
        ProviderDTO dto = new ProviderDTO();
        dto.setId("3");
        dto.setHosId("H303");
        dto.setSpeciality("Dermatology");
        ProviderEO eo = new ProviderEO();
        eo.setId("3");
        eo.setHosId("H303");
        eo.setSpeciality("Dermatology");

        Mockito.when(provideSer.updateProvider(eq("3"), any(ProviderEO.class))).thenReturn(eo);

        mockMvc.perform(put("/providers/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("3"))
                .andExpect(jsonPath("$.speciality").value("Dermatology"));
    }

    // --- DELETE /providers/{id}
    @Test
    void deleteProvider_shouldDeleteProvider() throws Exception {
        Mockito.doNothing().when(provideSer).deleteProvider("4");

        mockMvc.perform(delete("/providers/4"))
                .andExpect(status().isOk());
    }

    // --- GET /providers/filter
    @Test
    void filterProviders_shouldReturnFilteredProviders() throws Exception {
        ProviderEO providerEO = new ProviderEO();
        providerEO.setId("5");
        providerEO.setHosId("H505");
        providerEO.setSpeciality("Orthopedics");
        List<ProviderEO> filteredProviders = Collections.singletonList(providerEO);

        Mockito.when(provideSer.filterProviders(any(), any(), any(), any(), any(), any(), any(), any(), any()))
               .thenReturn(filteredProviders);

        mockMvc.perform(get("/providers/filter")
                .param("speciality", "Orthopedics")
                .param("minRating", "4.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("5"))
                .andExpect(jsonPath("$[0].speciality").value("Orthopedics"));
    }

    // --- POST /providers/{id}/reviews
    @Test
    void addReview_shouldAddReview() throws Exception {
        ProviderDTO.ReviewDTO reviewDTO = new ProviderDTO.ReviewDTO(
                "John Doe", "john@email.com", 5.0, "Excellent!", Instant.now()
        );
        Review review = new Review("John Doe", "john@email.com", 5.0, "Excellent!", Instant.now());

        ProviderEO updatedEO = new ProviderEO();
        updatedEO.setId("6");
        updatedEO.setReviews(List.of(review));
        updatedEO.setHosId("H606");

        Mockito.when(provideSer.addReview(eq("6"), any(Review.class))).thenReturn(updatedEO);

        mockMvc.perform(post("/providers/6/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("6"))
                .andExpect(jsonPath("$.reviews[0].customerName").value("John Doe"));
    }

    // --- GET /providers/{id}/doctors
    @Test
    void getProviderDoctors_shouldReturnDoctors() throws Exception {
        ProviderEO providerEO = new ProviderEO();
        providerEO.setId("7");
        providerEO.setDocId(Arrays.asList("d1", "d2"));

        Mockito.when(provideSer.getProviderById("7")).thenReturn(providerEO);

        DoctorDTO doc1 = new DoctorDTO();
        doc1.setId("d1");
        doc1.setName("Dr. Alpha");
        DoctorDTO doc2 = new DoctorDTO();
        doc2.setId("d2");
        doc2.setName("Dr. Beta");

        Mockito.when(doctorServiceUrl.fetchDoctorByDocId("d1")).thenReturn(doc1);
        Mockito.when(doctorServiceUrl.fetchDoctorByDocId("d2")).thenReturn(doc2);

        mockMvc.perform(get("/providers/7/doctors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("d1"))
                .andExpect(jsonPath("$[1].id").value("d2"));
    }

}
