package training.iqgateway;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class CustomersApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomersApplication.class, args);
	}
	
	

//	@Bean
//	public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
//	    Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
//	    DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
//	    typeMapper.setTrustedPackages("training.admin.iqgateway.dto.event", "java.util", "java.lang");
//	    converter.setJavaTypeMapper(typeMapper);
//	    return converter;
//	}

	
	

}
