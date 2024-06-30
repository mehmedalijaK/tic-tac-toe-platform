package schneider.tictactoe.userservice.dto;

import lombok.Data;
import schneider.tictactoe.userservice.model.User;

import java.time.LocalDateTime;

@Data
public class GameDto {
    private LocalDateTime date;
    private User winner;
    private User loser;
}
