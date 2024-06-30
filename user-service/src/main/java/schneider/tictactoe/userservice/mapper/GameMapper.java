package schneider.tictactoe.userservice.mapper;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import schneider.tictactoe.userservice.dto.GameDto;
import schneider.tictactoe.userservice.dto.GamesHistoryDto;
import schneider.tictactoe.userservice.model.Game;

@Component
@RequiredArgsConstructor
public class GameMapper {

    public GameDto toGameDto(Game game) {
        GameDto gameDto = new GameDto();
        gameDto.setWinner(game.getWinner());
        gameDto.setLoser(game.getLoser());
        gameDto.setDate(game.getDate());
        return gameDto;
    }
}
