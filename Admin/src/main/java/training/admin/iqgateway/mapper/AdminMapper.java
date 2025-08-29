package training.admin.iqgateway.mapper;

import training.admin.iqgateway.dto.AdminDTO;
import training.admin.iqgateway.model.AdminEO;

public class AdminMapper {
	
	// Method to convert AdminEO to AdminDTO
	public static AdminDTO toDTO(AdminEO adminEO) {
		 AdminDTO dto=new AdminDTO();
		 dto.setId(adminEO.get_id());
		 dto.setName(adminEO.getName());
		 dto.setEmail(adminEO.getEmail());
		 dto.setPassword(adminEO.getPassword());
		 dto.setRole(adminEO.getRole());
		 return dto;
	}
	
	// Method to convert AdminDTO to AdminEO
	public static AdminEO toEO(AdminDTO adminDTO) {
		AdminEO eo = new AdminEO();
		eo.set_id(adminDTO.getId());
		eo.setName(adminDTO.getName());
		eo.setEmail(adminDTO.getEmail());
		eo.setPassword(adminDTO.getPassword());
		eo.setRole(adminDTO.getRole());
		return eo;
	}

}
