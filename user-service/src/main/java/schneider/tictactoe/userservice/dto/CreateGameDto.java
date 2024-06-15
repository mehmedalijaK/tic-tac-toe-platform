package schneider.tictactoe.userservice.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatusCode;

import java.time.LocalDateTime;

@Data
@Builder
public class CreateGameDto {
    private String usernameWinner;
    private String usernameLoser;
    private LocalDateTime localDateTime;
}
