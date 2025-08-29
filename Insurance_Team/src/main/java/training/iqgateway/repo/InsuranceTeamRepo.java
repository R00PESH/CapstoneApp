package training.iqgateway.repo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import training.iqgateway.model.InsuranceTeamEO;

public interface InsuranceTeamRepo extends MongoRepository<InsuranceTeamEO, String> {
    Optional<InsuranceTeamEO> findByInsurerId(String insurerId);
    void deleteByInsurerId(String insurerId);
}
