package schneider.tictactoe.userservice.dto;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatusCode;

@Data
@Builder
public class CreateGameDto {
    private Long id;
}
