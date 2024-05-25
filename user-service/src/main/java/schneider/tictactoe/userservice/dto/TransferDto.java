package schneider.tictactoe.userservice.dto;

import java.util.HashMap;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TransferDto {

    @NotBlank(message = "Email cannot be empty")
    @Email
    private String emailReceiver;

    @NotBlank(message = "Type name can not be empty")
    private String typeName;

    private HashMap<String, String> params;

    @NotBlank
    private String username;
}