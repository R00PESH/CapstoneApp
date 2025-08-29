package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.iqgateway.dto.DoctorDTO;
import training.iqgateway.model.DoctorEO;
import training.iqgateway.model.DoctorEO.Review;
import training.iqgateway.service.DoctorService;
import training.iqgateway.service.impl.ProviderClientService;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DoctorController.class)
public class DoctorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorService doctorService;

    @MockBean
    private ProviderClientService providerClientService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getDoctorById_shouldReturnDoctor() throws Exception {
        DoctorEO doctorEO = new DoctorEO();
        doctorEO.setId("101");
        doctorEO.setName("Dr. Ravi");
        Mockito.when(doctorService.getDoctorById("101")).thenReturn(doctorEO);

        mockMvc.perform(get("/doctors/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("101"))
                .andExpect(jsonPath("$.name").value("Dr. Ravi"));
    }

    @Test
    void getAllDoctors_shouldReturnList() throws Exception {
        DoctorEO doctorEO = new DoctorEO();
        doctorEO.setId("102");
        doctorEO.setName("Dr. Shah");
        Mockito.when(doctorService.getAllDoctors()).thenReturn(Collections.singletonList(doctorEO));

        mockMvc.perform(get("/doctors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("102"))
                .andExpect(jsonPath("$[0].name").value("Dr. Shah"));
    }

    @Test
    void createDoctor_shouldCreateDoctor() throws Exception {
        DoctorDTO dto = new DoctorDTO();
        dto.setId("103");
        dto.setName("Dr. X");
        DoctorEO eo = new DoctorEO();
        eo.setId("103");
        eo.setName("Dr. X");

        Mockito.when(doctorService.createDoctor(any(DoctorEO.class))).thenReturn(eo);

        mockMvc.perform(post("/doctors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("103"))
                .andExpect(jsonPath("$.name").value("Dr. X"));
    }

    @Test
    void updateDoctor_shouldUpdateDoctor() throws Exception {
        DoctorDTO dto = new DoctorDTO();
        dto.setId("104");
        dto.setName("Dr. Y");
        DoctorEO eo = new DoctorEO();
        eo.setId("104");
        eo.setName("Dr. Y");

        Mockito.when(doctorService.updateDoctor(eq("104"), any(DoctorEO.class))).thenReturn(eo);

        mockMvc.perform(put("/doctors/104")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("104"))
                .andExpect(jsonPath("$.name").value("Dr. Y"));
    }

    @Test
    void deleteDoctor_shouldDeleteDoctor() throws Exception {
        Mockito.doNothing().when(doctorService).deleteDoctor("105");

        mockMvc.perform(delete("/doctors/105"))
                .andExpect(status().isOk());
    }

    @Test
    void filterDoctors_shouldReturnFilteredList() throws Exception {
        DoctorEO doctorEO = new DoctorEO();
        doctorEO.setId("106");
        doctorEO.setSpecialization("Cardiology");
        Mockito.when(doctorService.filterDoctors(any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(doctorEO));

        mockMvc.perform(get("/doctors/filter")
                .param("specialization", "Cardiology"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("106"))
                .andExpect(jsonPath("$[0].specialization").value("Cardiology"));
    }

    @Test
    void addReview_shouldAddReview() throws Exception {
        DoctorDTO.ReviewDTO reviewDTO = new DoctorDTO.ReviewDTO(1, "Ravi Shah", "ravi@email.com", 5.0, "Excellent!", Instant.now());
        Review review = new Review(1, "Ravi Shah", "ravi@email.com", 5.0, "Excellent!", Instant.now());

        DoctorEO updatedDoctorEO = new DoctorEO();
        updatedDoctorEO.setId("107");
        updatedDoctorEO.setReviews(List.of(review));
        updatedDoctorEO.setName("Dr. Ravi Shah");

        Mockito.when(doctorService.addReview(eq("107"), any(Review.class))).thenReturn(updatedDoctorEO);

        mockMvc.perform(post("/doctors/107/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("107"))
                .andExpect(jsonPath("$.reviews[0].customerName").value("Ravi Shah"));
    }
}
