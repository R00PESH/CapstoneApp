package training.iqgateway.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import training.iqgateway.dto.InsurancePlansDTO;
import training.iqgateway.service.InsurancePlansService;

import java.util.List;

@RestController
@RequestMapping("/insurance-plans")
public class InsurancePlansController {

    @Autowired
    private InsurancePlansService insurancePlansService;

    // CREATE: POST /insurance-plans
    @PostMapping
    public ResponseEntity<InsurancePlansDTO> createInsurancePlan(@RequestBody InsurancePlansDTO dto) {
        InsurancePlansDTO created = insurancePlansService.createPlan(dto);
        return ResponseEntity.ok(created);
    }

    // READ ALL: GET /insurance-plans
    @GetMapping
    public List<InsurancePlansDTO> getAllInsurancePlans() {
        return insurancePlansService.getAllPlans();
    }

    // READ ONE BY TITLE: GET /insurance-plans/{title}
    @GetMapping("/{title}")
    public ResponseEntity<InsurancePlansDTO> getInsurancePlanByTitle(@PathVariable String title) {
        InsurancePlansDTO plan = insurancePlansService.getPlanByTitle(title);
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(plan);
    }

    // UPDATE BY TITLE: PUT /insurance-plans/{title}
    @PutMapping("/{title}")
    public ResponseEntity<InsurancePlansDTO> updateInsurancePlanByTitle(
            @PathVariable String title,
            @RequestBody InsurancePlansDTO dto) {
        InsurancePlansDTO updated = insurancePlansService.updatePlanByTitle(title, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE BY TITLE: DELETE /insurance-plans/{title}
    @DeleteMapping("/{title}")
    public ResponseEntity<Void> deleteInsurancePlanByTitle(@PathVariable String title) {
        insurancePlansService.deletePlanByTitle(title);
        return ResponseEntity.noContent().build();
    }
}
