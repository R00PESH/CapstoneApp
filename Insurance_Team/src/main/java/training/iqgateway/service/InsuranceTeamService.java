package training.iqgateway.service;

import training.iqgateway.dto.InsuranceTeamDTO;

import java.util.List;
import java.util.Optional;

public interface InsuranceTeamService {
    InsuranceTeamDTO createInsuranceTeamMember(InsuranceTeamDTO dto);
    Optional<InsuranceTeamDTO> getInsuranceTeamMemberByInsurerId(String insurer_Id);
    List<InsuranceTeamDTO> getAllInsuranceTeamMembers();
    InsuranceTeamDTO updateInsuranceTeamMemberByInsurerId(String insurer_Id, InsuranceTeamDTO dto);
    void deleteInsuranceTeamMemberByInsurerId(String insurer_Id);
}
