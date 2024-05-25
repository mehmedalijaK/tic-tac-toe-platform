package raf.microservice.components.notificationservice.listener;

import jakarta.jms.JMSException;
import jakarta.jms.Message;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
import raf.microservice.components.notificationservice.dto.TransferDto;
import raf.microservice.components.notificationservice.exceptions.NotFoundException;
import raf.microservice.components.notificationservice.listener.helper.MessageHelper;
import raf.microservice.components.notificationservice.mapper.model.Type;
import raf.microservice.components.notificationservice.repository.TypeRepository;
import raf.microservice.components.notificationservice.service.EmailService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Component
public class EmailListener {

    private final MessageHelper messageHelper;
    private final EmailService emailService;
    private final TypeRepository typeRepository;


    public EmailListener(MessageHelper messageHelper, EmailService emailService, TypeRepository typeRepository
                       ){
        this.emailService = emailService;
        this.messageHelper = messageHelper;
        this.typeRepository = typeRepository;
    }

    @JmsListener(destination = "${destination.sendEmails}", concurrency = "5-10")
    public void sendMail(Message message) throws JMSException{
        TransferDto transferDto = messageHelper.getMessage(message, TransferDto.class);

        Optional<Type> type = typeRepository.findTypeByName(transferDto.getTypeName());

        if(type.isEmpty()) throw new NotFoundException("Type not found");

        String messageToSend = type.get().getFormat();

        for(Map.Entry<String, String> entry: transferDto.getParams().entrySet()) {
            messageToSend = messageToSend.replace(entry.getKey(), entry.getValue());
        }

        emailService.sendSimpleMessage(transferDto.getEmailReceiver(), type.get().getName(), messageToSend);

    }


}


