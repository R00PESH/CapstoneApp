package training.iqgateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import training.iqgateway.dto.CustomerDTO;
import training.iqgateway.service.impl.CustomerServiceUrl;

import java.util.List;

@RestController
@RequestMapping("/insurer/customers") // Adapt as needed
public class InsuranceTeamCustomerController {

    @Autowired
    private CustomerServiceUrl customerServiceUrl;

    // CREATE customer
    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO dto) {
        CustomerDTO created = customerServiceUrl.createCustomer(dto);
        return ResponseEntity.ok(created);
    }

    // GET ALL customers
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerServiceUrl.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // GET customer by AdharNum
    @GetMapping("/{adharNum}")
    public ResponseEntity<CustomerDTO> getCustomerByAdharNum(@PathVariable String adharNum) {
        CustomerDTO customer = customerServiceUrl.getCustomerByAdharNum(adharNum);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    // UPDATE customer by AdharNum
    @PutMapping("/{adharNum}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable String adharNum, @RequestBody CustomerDTO dto) {
        CustomerDTO updated = customerServiceUrl.updateCustomer(adharNum, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE customer by AdharNum
    @DeleteMapping("/{adharNum}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String adharNum) {
        customerServiceUrl.deleteCustomer(adharNum);
        return ResponseEntity.noContent().build();
    }
}
