package training.admin.iqgateway.service;

import training.admin.iqgateway.dto.AdminDTO;
import java.util.List;
import java.util.Optional;

public interface AdminService {
    AdminDTO createAdmin(AdminDTO adminDTO);
    Optional<AdminDTO> getAdminById(String id);
    List<AdminDTO> getAllAdmins();
    AdminDTO updateAdmin(String id, AdminDTO adminDTO);
    void deleteAdmin(String id);
}
