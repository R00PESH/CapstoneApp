package training.iqgateway.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import training.iqgateway.dto.DoctorDTO;
import training.iqgateway.dto.DoctorDTO.ReviewDTO;
import training.iqgateway.service.DoctorServiceUrl;

@RestController
@RequestMapping("/admin/doctors") // This is your admin API base path
public class AdminController {

    @Autowired
    private DoctorServiceUrl doctorServiceUrl;

    // CREATE
    @PostMapping
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        DoctorDTO created = doctorServiceUrl.createDoctor(doctorDTO);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        List<DoctorDTO> doctors = doctorServiceUrl.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable String id) {
        DoctorDTO doctor = doctorServiceUrl.getDoctorById(id);
        if (doctor == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doctor);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable String id, @RequestBody DoctorDTO doctorDTO) {
        DoctorDTO updated = doctorServiceUrl.updateDoctor(id, doctorDTO);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorServiceUrl.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    // ADD REVIEW
    @PostMapping("/{id}/reviews")
    public ResponseEntity<DoctorDTO> addReview(
            @PathVariable String id,
            @RequestBody ReviewDTO reviewDTO) {
        DoctorDTO doctor = doctorServiceUrl.addReview(id, reviewDTO);
        if (doctor == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(doctor);
    }

}

