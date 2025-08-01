package training.iqgateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class InsuranceTeamApplication {

	public static void main(String[] args) {
		SpringApplication.run(InsuranceTeamApplication.class, args);
	}
	
	@Bean// This bean is used to create a RestTemplate instance for making HTTP requests
	public static RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
