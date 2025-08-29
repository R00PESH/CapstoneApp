package training.admin.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.admin.iqgateway.dto.DoctorDTO;
import training.admin.iqgateway.dto.DoctorDTO.ReviewDTO;
import training.admin.iqgateway.service.DoctorServiceUrl;

import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorServiceUrl doctorServiceUrl;

    @Autowired
    private ObjectMapper objectMapper;

    private DoctorDTO createSampleDoctor() {
        DoctorDTO doctor = new DoctorDTO();
        doctor.setId("doc1");
        doctor.setDocId("DOC123");
        doctor.setHosId("Hos123");
        doctor.setName("Dr. John Doe");
        doctor.setLicenseNumber("LIC123");
        doctor.setQualification("MBBS");
        doctor.setSpecialization("Cardiology");
        doctor.setyearsOfExp(10);
        doctor.setAvailabilityStatus("Available");
        doctor.setJoiningDate(Instant.parse("2020-01-01T00:00:00Z"));
        doctor.setRating(4.5);
        return doctor;
    }

    private ReviewDTO createSampleReview() {
        return new ReviewDTO(1, "Alice", "alice@example.com", 5.0, "Excellent doctor", Instant.now());
    }

    @Test
    void createDoctor_shouldReturnCreatedDoctor() throws Exception {
        DoctorDTO inputDoctor = createSampleDoctor();
        Mockito.when(doctorServiceUrl.createDoctor(any(DoctorDTO.class))).thenReturn(inputDoctor);

        mockMvc.perform(post("/admin/doctors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDoctor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("doc1"))
                .andExpect(jsonPath("$.docId").value("DOC123"))
                .andExpect(jsonPath("$.name").value("Dr. John Doe"));
    }

    @Test
    void getAllDoctors_shouldReturnList() throws Exception {
        DoctorDTO doctor1 = createSampleDoctor();
        DoctorDTO doctor2 = createSampleDoctor();
        doctor2.setId("doc2");
        doctor2.setDocId("DOC456");
        doctor2.setName("Dr. Jane Smith");

        Mockito.when(doctorServiceUrl.getAllDoctors()).thenReturn(List.of(doctor1, doctor2));

        mockMvc.perform(get("/admin/doctors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value("doc1"))
                .andExpect(jsonPath("$[1].id").value("doc2"));
    }

    @Test
    void getDoctorById_shouldReturnDoctor() throws Exception {
        DoctorDTO doctor = createSampleDoctor();
        Mockito.when(doctorServiceUrl.getDoctorById("doc1")).thenReturn(doctor);

        mockMvc.perform(get("/admin/doctors/doc1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("doc1"))
                .andExpect(jsonPath("$.name").value("Dr. John Doe"));
    }

    @Test
    void getDoctorById_shouldReturnNotFound() throws Exception {
        Mockito.when(doctorServiceUrl.getDoctorById("nonexistent")).thenReturn(null);

        mockMvc.perform(get("/admin/doctors/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateDoctor_shouldReturnUpdatedDoctor() throws Exception {
        DoctorDTO updatedDoctor = createSampleDoctor();
        updatedDoctor.setName("Dr. John Updated");
        Mockito.when(doctorServiceUrl.updateDoctor(eq("doc1"), any(DoctorDTO.class))).thenReturn(updatedDoctor);

        mockMvc.perform(put("/admin/doctors/doc1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDoctor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dr. John Updated"));
    }

    @Test
    void updateDoctor_shouldReturnNotFound() throws Exception {
        DoctorDTO updatedDoctor = createSampleDoctor();
        Mockito.when(doctorServiceUrl.updateDoctor(eq("nonexistent"), any(DoctorDTO.class))).thenReturn(null);

        mockMvc.perform(put("/admin/doctors/nonexistent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDoctor)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteDoctor_shouldReturnOk() throws Exception {
        Mockito.doNothing().when(doctorServiceUrl).deleteDoctor("doc1");

        mockMvc.perform(delete("/admin/doctors/doc1"))
                .andExpect(status().isOk());

        Mockito.verify(doctorServiceUrl).deleteDoctor("doc1");
    }

    @Test
    void addReview_shouldReturnUpdatedDoctor() throws Exception {
        DoctorDTO doctorWithReview = createSampleDoctor();
        ReviewDTO review = createSampleReview();
        doctorWithReview.setReviews(List.of(review));

        Mockito.when(doctorServiceUrl.addReview(eq("doc1"), any(ReviewDTO.class))).thenReturn(doctorWithReview);

        mockMvc.perform(post("/admin/doctors/doc1/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(review)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviews", hasSize(1)))
                .andExpect(jsonPath("$.reviews[0].customerName").value(review.getCustomerName()));
    }
}
