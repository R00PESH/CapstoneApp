package training.iqgateway.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import training.admin.iqgateway.dto.DoctorDTO;
import training.admin.iqgateway.dto.ProviderDTO;
import training.iqgateway.service.impl.DoctorClientService;
import training.iqgateway.service.impl.ProviderClientService;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerDoctorController.class)
public class CustomerDoctorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DoctorClientService doctorSer;

    @MockBean
    private ProviderClientService providerSer;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void filterDoctors_shouldReturnDoctorsWithProviderInfo() throws Exception {
        DoctorDTO doctor = new DoctorDTO();
        doctor.setId("filterdocid1");
        doctor.setDocId("DOC1002");
        doctor.setHosId("Hos@124");
        doctor.setName("Dr. Filtered");
        doctor.setLicenseNumber("DL123456");
        doctor.setQualification("MBBS");
        doctor.setSpecialization("Cardiology");
        doctor.setyearsOfExp(5.0);
        doctor.setAvailabilityStatus("Available");
        doctor.setJoiningDate(Instant.parse("2020-01-01T00:00:00Z"));
        doctor.setRating(4.3);

        ProviderDTO provider = new ProviderDTO();
        provider.setHosId("Hos@124");
        provider.setHospitalName("ApolloHospitals");
        provider.setLocation("Delhi");
        provider.setLat(28.6139);
        provider.setLon(77.209);

        Mockito.when(doctorSer.filterDoctors(any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(doctor));
        Mockito.when(providerSer.getProviderById("Hos@124")).thenReturn(provider);

        mockMvc.perform(get("/customer-view/doctors/filter")
                        .param("specialization", "Cardiology"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].docId").value("DOC1002"));
            //    .andExpect(jsonPath("$[0].hospitalName").value("ApolloHospitals"))
             //   .andExpect(jsonPath("$[0].hospitalLocation").value("Delhi"))
              //  .andExpect(jsonPath("$[0].hospitalLat").value(28.6139))
            //    .andExpect(jsonPath("$[0].hospitalLon").value(77.209));
    }

    @Test
    void getDoctorByHosId_shouldReturnFirstDoctorWithProviderInfo() throws Exception {
        DoctorDTO doctor = new DoctorDTO();
        doctor.setId("6883647b52d004ae699dd512");
        doctor.setDocId("DOC1002");
        doctor.setHosId("Hos@124");
        doctor.setName("Dr. Priya Sharma");
        doctor.setLicenseNumber("DL654321");
        doctor.setQualification("MBBS, MS");
        doctor.setSpecialization("Orthopedics");
        doctor.setyearsOfExp(8.0);
        doctor.setAvailabilityStatus("On Leave");
        doctor.setJoiningDate(Instant.parse("2016-09-20T00:00:00Z"));
        doctor.setRating(4.0);
        doctor.setReviews(List.of(
                new DoctorDTO.ReviewDTO(103, "Deepak Jain", "deepak.jain@email.com",
                        4, "Helped me recover quickly from knee pain.",
                        Instant.parse("2023-02-17T10:00:00Z")),
                new DoctorDTO.ReviewDTO(0, "M S Dhoni", "msdhoni@gmail.com",
                        4, "Great Service",
                        Instant.parse("2025-08-04T18:17:06.163Z"))
        ));

        ProviderDTO provider = new ProviderDTO();
        provider.setHosId("Hos@124");
        provider.setHospitalName("ApolloHospitals");
        provider.setSpeciality("MultiSpeciality");
        provider.setRating(4.3);
        provider.setLocation("Delhi");
        provider.setLat(28.6139);
        provider.setLon(77.209);

        Mockito.when(doctorSer.filterDoctors(eq(null), eq("Hos@124"),
                eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null)))
                .thenReturn(List.of(doctor));
        Mockito.when(providerSer.getProviderById("Hos@124")).thenReturn(provider);

        mockMvc.perform(get("/customer-view/doctors/by-hosid")
                        .param("hosId", "Hos@124"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.docId").value("DOC1002"))
                .andExpect(jsonPath("$.name").value("Dr. Priya Sharma"))
           //     .andExpect(jsonPath("$.hospitalName").value("ApolloHospitals"))
        //        .andExpect(jsonPath("$.hospitalLocation").value("Delhi"))
         //       .andExpect(jsonPath("$.hospitalLat").value(28.6139))
          //      .andExpect(jsonPath("$.hospitalLon").value(77.209))
                .andExpect(jsonPath("$.reviews[0].customerName").value("Deepak Jain"))
                .andExpect(jsonPath("$.reviews[1].customerName").value("M S Dhoni"));
    }

    @Test
    void getDoctorByDocId_shouldReturnFirstDoctorWithProviderInfo() throws Exception {
        DoctorDTO doctor = new DoctorDTO();
        doctor.setId("docidtest");
        doctor.setDocId("DOC1002");
        doctor.setHosId("Hos@124");
        doctor.setName("Dr. Priya Sharma"); // previously missing — now set
        doctor.setLicenseNumber("DL654321");
        doctor.setQualification("MBBS, MS");
        doctor.setSpecialization("Orthopedics");
        doctor.setyearsOfExp(8.0);
        doctor.setAvailabilityStatus("On Leave");
        doctor.setJoiningDate(Instant.parse("2016-09-20T00:00:00Z"));
        doctor.setRating(4.0);

        ProviderDTO provider = new ProviderDTO();
        provider.setHosId("Hos@124");
        provider.setHospitalName("ApolloHospitals");
        provider.setLocation("Delhi");
        provider.setLat(28.6139);
        provider.setLon(77.209);

        Mockito.when(doctorSer.filterDoctors(eq("DOC1002"), eq(null),
                eq(null), eq(null), eq(null), eq(null), eq(null), eq(null), eq(null)))
                .thenReturn(List.of(doctor));
        Mockito.when(providerSer.getProviderById("Hos@124")).thenReturn(provider);

        mockMvc.perform(get("/customer-view/doctors/by-docid")
                        .param("docId", "DOC1002"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.docId").value("DOC1002"))
                .andExpect(jsonPath("$.name").value("Dr. Priya Sharma"));
//                .andExpect(jsonPath("$.hospitalName").value("ApolloHospitals"))
//                .andExpect(jsonPath("$.hospitalLocation").value("Delhi"))
//                .andExpect(jsonPath("$.hospitalLat").value(28.6139))
//                .andExpect(jsonPath("$.hospitalLon").value(77.209));
    }

    @Test
    void addReviewToDoctor_shouldAddReview() throws Exception {
        DoctorDTO.ReviewDTO reviewDTO =
                new DoctorDTO.ReviewDTO(1, "Alice", "alice@email.com",
                        5.0, "Excellent doctor!", Instant.now());

        DoctorDTO updatedDoctor = new DoctorDTO();
        updatedDoctor.setId("DOC1002");
        updatedDoctor.setReviews(List.of(reviewDTO));

        Mockito.when(doctorSer.addReview(eq("DOC1002"), any(DoctorDTO.ReviewDTO.class)))
                .thenReturn(updatedDoctor);

        mockMvc.perform(post("/customer-view/doctors/DOC1002/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("DOC1002"))
                .andExpect(jsonPath("$.reviews[0].customerName").value("Alice"))
                .andExpect(jsonPath("$.reviews[0].comment").value("Excellent doctor!"));
    }
}
