package schneider.tictactoe.userservice.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class GamesHistoryDto {
    List<GameDto> myGames = new ArrayList<>();
}
