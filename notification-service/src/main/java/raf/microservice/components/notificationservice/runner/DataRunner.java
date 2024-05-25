package raf.microservice.components.notificationservice.runner;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;
import raf.microservice.components.notificationservice.listener.helper.MessageHelper;
import raf.microservice.components.notificationservice.mapper.model.Type;
import raf.microservice.components.notificationservice.repository.TypeRepository;


@Profile({"default"})
@Component
public class DataRunner implements CommandLineRunner {

    private final TypeRepository typeRepository;
    private final JmsTemplate jmsTemplate;
    private final String sendEmailDestination;
    private final MessageHelper messageHelper;

    public DataRunner(TypeRepository typeRepository
    , JmsTemplate jmsTemplate, @Value("${destination.sendEmails}") String sendEmailDestination,
                      MessageHelper messageHelper){
        this.typeRepository = typeRepository;
        this.jmsTemplate = jmsTemplate;
        this.sendEmailDestination = sendEmailDestination;
        this.messageHelper = messageHelper;
    }

    @Override
    public void run(String... args) throws Exception {
        Type type = new Type();
        type.setName("REGISTER_USER");
        type.setFormat("Hello %username% ! To verify your account please open following link %link%");
        typeRepository.save(type);

        Type type1 = new Type();
        type1.setName("LOGIN_USER");
        type1.setFormat("Hello %username% ! Someone logged in from your account!");
        typeRepository.save(type1);

//        Type type1 = new Type();
//        type1.setName("CANCELED_TR");
//        type1.setFormat("Hello! Training on %date% is canceled.");
//
//        typeRepository.save(type1);
////
//        Type type2 = new Type();
//        type2.setName("SCHED_TR");
//        type2.setFormat("Training scheduled successfully!");
//        typeRepository.save(type2);
//
//        Type type3 = new Type();
//        type3.setName("CHANGED_PASSWORD");
//        type3.setFormat("Hello %name% %lastname% ! Someone just logged in to your account.");
//        typeRepository.save(type3);

//        HashMap<String, String> paramsMap = new HashMap<>();
//        paramsMap.put("%name%", "Mehmedalija");
//        paramsMap.put("%lastname%", "Karisik");
//        paramsMap.put("%link%", "/link.com");
////        type.setFormat("Hello %name% %lastname% ! To verify your account please open following link %link%");
//        TransferDto transferDto = new TransferDto("karisik.mehmedalija@gmail.com", "REGISTER_USER", paramsMap, "john_doe");
//
//
//        jmsTemplate.convertAndSend(sendEmailDestination, messageHelper.createTextMessage(transferDto));

    }
}
