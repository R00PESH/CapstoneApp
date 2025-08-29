package training.iqgateway.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import training.iqgateway.dto.InsuranceTeamDTO;
import training.iqgateway.service.InsuranceTeamService;

import java.util.List;

@RestController
@RequestMapping("/api/insurance-team")
public class InsuranceTeamController {

    private final InsuranceTeamService insuranceTeamService;

    @Autowired
    public InsuranceTeamController(InsuranceTeamService insuranceTeamService) {
        this.insuranceTeamService = insuranceTeamService;
    }

    @PostMapping
    public ResponseEntity<InsuranceTeamDTO> createInsuranceTeamMember(@RequestBody InsuranceTeamDTO dto) {
        InsuranceTeamDTO created = insuranceTeamService.createInsuranceTeamMember(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/insurer/{insurerId}")
    public ResponseEntity<InsuranceTeamDTO> getByInsurerId(@PathVariable String insurerId) {
        return insuranceTeamService.getInsuranceTeamMemberByInsurerId(insurerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<InsuranceTeamDTO>> getAllInsuranceTeamMembers() {
        List<InsuranceTeamDTO> list = insuranceTeamService.getAllInsuranceTeamMembers();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/insurer/{insurerId}")
    public ResponseEntity<InsuranceTeamDTO> updateByInsurerId(@PathVariable String insurerId, @RequestBody InsuranceTeamDTO dto) {
        InsuranceTeamDTO updated = insuranceTeamService.updateInsuranceTeamMemberByInsurerId(insurerId, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/insurer/{insurerId}")
    public ResponseEntity<Void> deleteByInsurerId(@PathVariable String insurerId) {
        insuranceTeamService.deleteInsuranceTeamMemberByInsurerId(insurerId);
        return ResponseEntity.noContent().build();
    }
}
