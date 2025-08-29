package training.admin.iqgateway.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import training.admin.iqgateway.dto.AdminDTO;
import training.admin.iqgateway.model.AdminEO;
import training.admin.iqgateway.repo.AdminRepo;
import training.admin.iqgateway.service.AdminService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepo adminRepo;

    @Autowired
    public AdminServiceImpl(AdminRepo adminRepo) {
        this.adminRepo = adminRepo;
    }

    private AdminDTO mapToDTO(AdminEO entity) {
        return new AdminDTO(entity.get_id(), entity.getName(), entity.getEmail(), entity.getPassword(), entity.getRole());
    }

    private AdminEO mapToEntity(AdminDTO dto) {
        return new AdminEO(dto.getId(), dto.getName(), dto.getEmail(), dto.getPassword(), dto.getRole());
    }

    @Override
    public AdminDTO createAdmin(AdminDTO adminDTO) {
        AdminEO adminEO = mapToEntity(adminDTO);
        AdminEO savedAdmin = adminRepo.save(adminEO);
        return mapToDTO(savedAdmin);
    }

    @Override
    public Optional<AdminDTO> getAdminById(String id) {
        return adminRepo.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO updateAdmin(String id, AdminDTO adminDTO) {
        Optional<AdminEO> existingAdminOpt = adminRepo.findById(id);
        if (existingAdminOpt.isPresent()) {
            AdminEO adminEO = existingAdminOpt.get();
            adminEO.setName(adminDTO.getName());
            adminEO.setEmail(adminDTO.getEmail());
            adminEO.setPassword(adminDTO.getPassword());
            adminEO.setRole(adminDTO.getRole());
            AdminEO updatedAdmin = adminRepo.save(adminEO);
            return mapToDTO(updatedAdmin);
        } else {
            // Or throw exception for not found
            return null;
        }
    }

    @Override
    public void deleteAdmin(String id) {
        adminRepo.deleteById(id);
    }
}

