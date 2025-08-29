package training.admin.iqgateway.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import training.admin.iqgateway.dto.ProviderDTO;
import training.admin.iqgateway.dto.DoctorDTO.ReviewDTO;
import training.admin.iqgateway.service.ProviderServiceUrl;

@RestController
@RequestMapping("/admin/providers")
public class AdminProviderController {

    @Autowired
    private ProviderServiceUrl providerServiceUrl;

    // CREATE Provider
    @PostMapping
    public ResponseEntity<ProviderDTO> createProvider(@RequestBody ProviderDTO providerDTO) {
        ProviderDTO created = providerServiceUrl.createProvider(providerDTO);
        return ResponseEntity.ok(created);
    }

    // READ ALL Providers
    @GetMapping
    public ResponseEntity<List<ProviderDTO>> getAllProviders() {
        List<ProviderDTO> providers = providerServiceUrl.getAllProviders();
        return ResponseEntity.ok(providers);
    }

    // READ Provider by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProviderDTO> getProviderById(@PathVariable String id) {
        ProviderDTO provider = providerServiceUrl.getProviderById(id);
        if (provider == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(provider);
    }

    // READ Providers by Hospital Name
    @GetMapping("/hospital/{hospitalName}")
    public ResponseEntity<List<ProviderDTO>> getProviderByHospital(@PathVariable String hospitalName) {
        List<ProviderDTO> providers = providerServiceUrl.getProviderByHospital(hospitalName);
        return ResponseEntity.ok(providers);
    }

    // UPDATE Provider
    @PutMapping("/{id}")
    public ResponseEntity<ProviderDTO> updateProvider(@PathVariable String id, @RequestBody ProviderDTO providerDTO) {
        ProviderDTO updated = providerServiceUrl.updateProvider(id, providerDTO);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


    // DELETE Provider
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable String id) {
        providerServiceUrl.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }

    // ADD REVIEW to Provider
    @PostMapping("/{id}/reviews")
    public ResponseEntity<ProviderDTO> addReview(@PathVariable String id, @RequestBody ReviewDTO reviewDTO) {
        ProviderDTO updated = providerServiceUrl.addReview(id, reviewDTO);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

}

