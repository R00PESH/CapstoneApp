package training.iqgateway.service;



import java.util.List;
import training.iqgateway.dto.InsurancePlansDTO;

public interface InsurancePlansService {

    // CREATE
    InsurancePlansDTO createPlan(InsurancePlansDTO plan);

    // READ ALL
    List<InsurancePlansDTO> getAllPlans();

    // READ BY BUSINESS ID
    InsurancePlansDTO getPlanByTitle(String title);

    // UPDATE
    InsurancePlansDTO updatePlanByTitle(String title, InsurancePlansDTO plan);

    // DELETE
    void deletePlanByTitle(String title);


}
