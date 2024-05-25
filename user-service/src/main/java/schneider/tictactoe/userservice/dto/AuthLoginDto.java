package schneider.tictactoe.userservice.dto;

import lombok.Data;

@Data
public class AuthLoginDto {
    private String username;
    private String password;
}
