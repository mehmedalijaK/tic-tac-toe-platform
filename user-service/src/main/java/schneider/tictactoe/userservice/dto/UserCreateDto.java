package schneider.tictactoe.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserCreateDto {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 5, max = 16, message = "Username must be between 5 and 16 characters")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email
    private String email;

}
