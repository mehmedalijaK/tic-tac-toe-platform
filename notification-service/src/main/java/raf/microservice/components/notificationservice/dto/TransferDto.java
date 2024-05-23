package raf.microservice.components.notificationservice.dto;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@Getter
@Setter
public class TransferDto {

    @NotBlank(message = "Email cannot be empty")
    @Email
    private String emailReceiver;

    @NotBlank(message = "Type name can not be empty")
    private String typeName;

    private HashMap<String, String> params;

    @NotBlank
    private String username;

    public TransferDto(String emailReceiver, String typeName, HashMap<String, String> params, String username) {
        this.emailReceiver = emailReceiver;
        this.typeName = typeName;
        this.params = params;
        this.username = username;
    }

    @Override
    public String toString() {
        return "TransferDto{" +
                "emailReceiver='" + emailReceiver + '\'' +
                ", typeName='" + typeName + '\'' +
                ", params=" + params +
                ", username='" + username + '\'' +
                '}';
    }
}
