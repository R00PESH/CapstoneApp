package training.iqgateway.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//training.iqgateway.customer.config.RabbitMQConfig.java
@Configuration
public class RabbitMQConfig {

 @Bean
 public Queue hospitalCreatedQueue() {
     return new Queue("hospital.created.queue", true);
 }

 @Bean
 public TopicExchange hospitalExchange() {
     return new TopicExchange("hospital.exchange");
 }

 @Bean
 public Binding hospitalQueueBinding(Queue hospitalCreatedQueue, TopicExchange hospitalExchange) {
     return BindingBuilder.bind(hospitalCreatedQueue)
         .to(hospitalExchange)
         .with("hospital.created");
 }
 
//Configure Jackson2JsonMessageConverter for JSON message conversion and trusted packages
 @Bean
 public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
     Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
     DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
     // Trust your event package; add java.lang and java.util as well
     typeMapper.setTrustedPackages("training.admin.iqgateway.dto.event", "java.util", "java.lang");
     converter.setJavaTypeMapper(typeMapper);
     return converter;
 }

 // Attach the converter to the listener container factory
 @Bean
 public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
     SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
     factory.setConnectionFactory(connectionFactory);
     factory.setMessageConverter(jackson2JsonMessageConverter());
     return factory;
 }

 
}

