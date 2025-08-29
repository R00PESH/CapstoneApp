package training.iqgateway.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import training.iqgateway.dto.InsuranceTeamDTO;
import training.iqgateway.model.InsuranceTeamEO;
import training.iqgateway.repo.InsuranceTeamRepo;
import training.iqgateway.service.InsuranceTeamService;

@Service
public class InsuranceTeamServiceImpl implements InsuranceTeamService {

    private final InsuranceTeamRepo insuranceTeamRepo;

    @Autowired
    public InsuranceTeamServiceImpl(InsuranceTeamRepo insuranceTeamRepo) {
        this.insuranceTeamRepo = insuranceTeamRepo;
    }

    private InsuranceTeamDTO mapToDTO(InsuranceTeamEO entity) {
        return new InsuranceTeamDTO(
                entity.getInsurerId(),
                entity.getName(),
                entity.getEmail(),
                entity.getPassword(),
                entity.getHire_date(),
                entity.getActive_status()
        );
    }

    private InsuranceTeamEO mapToEntity(InsuranceTeamDTO dto, InsuranceTeamEO existingEntity) {
        existingEntity.setName(dto.getName());
        existingEntity.setEmail(dto.getEmail());
        existingEntity.setPassword(dto.getPassword());
        existingEntity.setHire_date(dto.getHire_date());
        existingEntity.setActive_status(dto.getActive_status());
        return existingEntity;
    }

    @Override
    public InsuranceTeamDTO createInsuranceTeamMember(InsuranceTeamDTO dto) {
        InsuranceTeamEO entity = new InsuranceTeamEO();
        entity.setInsurerId(dto.getInsurerId());
        entity = mapToEntity(dto, entity);
        InsuranceTeamEO saved = insuranceTeamRepo.save(entity);
        return mapToDTO(saved);
    }

    @Override
    public Optional<InsuranceTeamDTO> getInsuranceTeamMemberByInsurerId(String insurer_Id) {
        return insuranceTeamRepo.findByInsurerId(insurer_Id).map(this::mapToDTO);
    }

    @Override
    public List<InsuranceTeamDTO> getAllInsuranceTeamMembers() {
        return insuranceTeamRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InsuranceTeamDTO updateInsuranceTeamMemberByInsurerId(String insurer_Id, InsuranceTeamDTO dto) {
        Optional<InsuranceTeamEO> existingOpt = insuranceTeamRepo.findByInsurerId(insurer_Id);
        if (existingOpt.isPresent()) {
            InsuranceTeamEO existingEntity = existingOpt.get();
            existingEntity = mapToEntity(dto, existingEntity);
            InsuranceTeamEO updated = insuranceTeamRepo.save(existingEntity);
            return mapToDTO(updated);
        }
        // Optionally throw a NotFoundException here instead of returning null
        return null;
    }

    @Override
    public void deleteInsuranceTeamMemberByInsurerId(String insurer_Id) {
        insuranceTeamRepo.deleteByInsurerId(insurer_Id);
    }
}
