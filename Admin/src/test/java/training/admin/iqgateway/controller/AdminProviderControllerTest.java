package training.admin.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.admin.iqgateway.dto.ProviderDTO;
import training.admin.iqgateway.dto.ProviderDTO.ReviewDTO;
import training.admin.iqgateway.controller.AdminProviderController;
import training.admin.iqgateway.service.ProviderServiceUrl;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminProviderController.class)
public class AdminProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderServiceUrl providerServiceUrl;

    @Autowired
    private ObjectMapper objectMapper;

    private ProviderDTO createSampleProvider() {
        ProviderDTO provider = new ProviderDTO();
        provider.setId("prov123");
        provider.setHosId("Hos999");
        provider.setHospitalName("City Hospital");
        provider.setInsurancePlans(List.of("PlanA", "PlanB"));
        provider.setLocation("Some City");
        provider.setZipcode(12345L);
        provider.setLat(12.34);
        provider.setLon(56.78);
        provider.setRating(4.2);
        provider.setReviews(null);
        provider.setActiveStatus("Available");
        provider.setEmail("contact@cityhospital.com");
//        provider.setProviderIdList(List.of("DOC1", "DOC2")); // replace with appropriate setter if field name differs
        return provider;
    }

    private ReviewDTO createSampleReview() {
        return new ReviewDTO("John Doe", "john.doe@example.com", 4.5, "Professional service", java.time.Instant.now());
    }

    @Test
    void createProvider_shouldReturnCreatedProvider() throws Exception {
        ProviderDTO input = createSampleProvider();
        Mockito.when(providerServiceUrl.createProvider(any())).thenReturn(input);

        mockMvc.perform(post("/admin/providers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("prov123"))
            .andExpect(jsonPath("$.hospitalName").value("City Hospital"));
    }

    @Test
    void getAllProviders_shouldReturnList() throws Exception {
        ProviderDTO p1 = createSampleProvider();
        ProviderDTO p2 = createSampleProvider();
        p2.setId("prov456");
        p2.setHospitalName("Town Clinic");

        Mockito.when(providerServiceUrl.getAllProviders()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/admin/providers"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id").value("prov123"))
            .andExpect(jsonPath("$[1].id").value("prov456"));
    }

    @Test
    void getProviderById_shouldReturnProvider() throws Exception {
        ProviderDTO provider = createSampleProvider();
        Mockito.when(providerServiceUrl.getProviderById("prov123")).thenReturn(provider);

        mockMvc.perform(get("/admin/providers/prov123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("prov123"))
            .andExpect(jsonPath("$.hospitalName").value("City Hospital"));
    }

    @Test
    void getProviderById_shouldReturnNotFound() throws Exception {
        Mockito.when(providerServiceUrl.getProviderById("nonexistent")).thenReturn(null);

        mockMvc.perform(get("/admin/providers/nonexistent"))
            .andExpect(status().isNotFound());
    }

    @Test
    void getProvidersByHospital_shouldReturnList() throws Exception {
        ProviderDTO p1 = createSampleProvider();
        List<ProviderDTO> providers = List.of(p1);
        Mockito.when(providerServiceUrl.getProviderByHospital("City Hospital")).thenReturn(providers);

        mockMvc.perform(get("/admin/providers/hospital/City Hospital"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].hospitalName").value("City Hospital"));
    }

    @Test
    void updateProvider_shouldReturnUpdatedProvider() throws Exception {
        ProviderDTO updated = createSampleProvider();
        updated.setHospitalName("Updated Hospital");
        Mockito.when(providerServiceUrl.updateProvider(eq("prov123"), any())).thenReturn(updated);

        mockMvc.perform(put("/admin/providers/prov123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hospitalName").value("Updated Hospital"));
    }

    @Test
    void updateProvider_shouldReturnNotFound() throws Exception {
        ProviderDTO updated = createSampleProvider();
        Mockito.when(providerServiceUrl.updateProvider(eq("nonexistent"), any())).thenReturn(null);

        mockMvc.perform(put("/admin/providers/nonexistent")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteProvider_shouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(providerServiceUrl).deleteProvider("prov123");

        mockMvc.perform(delete("/admin/providers/prov123"))
            .andExpect(status().isNoContent());

        Mockito.verify(providerServiceUrl).deleteProvider("prov123");
    }

    @Test
    void addReview_shouldReturnUpdatedProvider() throws Exception {
        ProviderDTO providerWithReview = createSampleProvider();
        ReviewDTO review = createSampleReview();
        providerWithReview.setReviews(List.of(review));

        Mockito.when(providerServiceUrl.addReview(eq("prov123"), any())).thenReturn(providerWithReview);

        mockMvc.perform(post("/admin/providers/prov123/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(review)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reviews", hasSize(1)))
            .andExpect(jsonPath("$.reviews[0].customerName").value(review.getCustomerName()));
    }
}
