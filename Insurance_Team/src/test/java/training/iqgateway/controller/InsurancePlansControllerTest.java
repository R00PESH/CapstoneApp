package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.iqgateway.dto.InsurancePlansDTO;
import training.iqgateway.dto.InsurancePlansDTO.CoverDTO;
import training.iqgateway.service.InsurancePlansService;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InsurancePlansController.class)
public class InsurancePlansControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InsurancePlansService insurancePlansService;

    @Autowired
    private ObjectMapper objectMapper;

    private InsurancePlansDTO createSamplePlan() {
        CoverDTO cover1 = new CoverDTO(1, "Hospitalization Cover", "Covers hospitalization charges", "50000");
        CoverDTO cover2 = new CoverDTO(2, "Outpatient Cover", "Covers outpatient procedures", "10000");

        return new InsurancePlansDTO(
                "plan123",
                "Health Secure",
                15000,
                Instant.parse("2025-12-31T23:59:59Z"),
                List.of(cover1, cover2),
                "No coverage for pre-existing conditions"
        );
    }

    @Test
    void createInsurancePlan_shouldReturnCreatedPlan() throws Exception {
        InsurancePlansDTO input = createSamplePlan();
        Mockito.when(insurancePlansService.createPlan(any(InsurancePlansDTO.class))).thenReturn(input);

        mockMvc.perform(post("/insurance-plans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("plan123"))
                .andExpect(jsonPath("$.title").value("Health Secure"))
                .andExpect(jsonPath("$.amount").value(15000))
                .andExpect(jsonPath("$.covers", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$.covers[0].coverName").value("Hospitalization Cover"))
                .andExpect(jsonPath("$.exclusion").value("No coverage for pre-existing conditions"));
    }

    @Test
    void getAllInsurancePlans_shouldReturnList() throws Exception {
        InsurancePlansDTO plan1 = createSamplePlan();
        InsurancePlansDTO plan2 = createSamplePlan();
        plan2.setId("plan456");
        plan2.setTitle("Life Shield");

        Mockito.when(insurancePlansService.getAllPlans()).thenReturn(List.of(plan1, plan2));

        mockMvc.perform(get("/insurance-plans"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("plan123"))
                .andExpect(jsonPath("$[1].id").value("plan456"));
    }

    @Test
    void getInsurancePlanByTitle_shouldReturnPlan() throws Exception {
        InsurancePlansDTO plan = createSamplePlan();
        Mockito.when(insurancePlansService.getPlanByTitle("Health Secure")).thenReturn(plan);

        mockMvc.perform(get("/insurance-plans/Health Secure"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Health Secure"))
                .andExpect(jsonPath("$.id").value("plan123"));
    }

    @Test
    void getInsurancePlanByTitle_shouldReturnNotFound() throws Exception {
        Mockito.when(insurancePlansService.getPlanByTitle("Nonexistent")).thenReturn(null);

        mockMvc.perform(get("/insurance-plans/Nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateInsurancePlanByTitle_shouldReturnUpdatedPlan() throws Exception {
        InsurancePlansDTO updated = createSamplePlan();
        updated.setTitle("Health Secure Plus");
        Mockito.when(insurancePlansService.updatePlanByTitle(eq("Health Secure"), any(InsurancePlansDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/insurance-plans/Health Secure")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Health Secure Plus"));
    }

    @Test
    void updateInsurancePlanByTitle_shouldReturnNotFound() throws Exception {
        InsurancePlansDTO updated = createSamplePlan();
        Mockito.when(insurancePlansService.updatePlanByTitle(eq("Nonexistent"), any(InsurancePlansDTO.class))).thenReturn(null);

        mockMvc.perform(put("/insurance-plans/Nonexistent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteInsurancePlanByTitle_shouldReturnNoContent() throws Exception {
        Mockito.doNothing().when(insurancePlansService).deletePlanByTitle("Health Secure");

        mockMvc.perform(delete("/insurance-plans/Health Secure"))
                .andExpect(status().isNoContent());

        Mockito.verify(insurancePlansService).deletePlanByTitle("Health Secure");
    }
}
