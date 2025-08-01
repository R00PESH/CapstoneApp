package training.iqgateway.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import training.iqgateway.dto.CustomerDTO;
import training.iqgateway.mapper.CustomerMapper;
import training.iqgateway.model.CustomerEO;
import training.iqgateway.service.CustomerService;

@RestController
@RequestMapping("/customers")
public class CustomerController {
	
	@Autowired
	private CustomerService customerSer;
	
	@PostMapping
    public CustomerDTO createCustomer(@RequestBody CustomerDTO dto) {
        CustomerEO entity = CustomerMapper.toEntity(dto);
        CustomerEO created = customerSer.createCustomer(entity);
        return CustomerMapper.toDto(created);
    }

    @GetMapping("/{id}")
    public CustomerDTO getCustomer(@PathVariable String id) {
        return CustomerMapper.toDto(customerSer.getCustomerByAdharNum(id));
    }

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        return customerSer.getAllCustomers().stream()
            .map(CustomerMapper::toDto)
            .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public CustomerDTO updateCustomer(@PathVariable String id, @RequestBody CustomerDTO dto) {
        CustomerEO updated = customerSer.updateCustomer(id, CustomerMapper.toEntity(dto));
        return CustomerMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerSer.deleteCustomer(id);
    }
}
