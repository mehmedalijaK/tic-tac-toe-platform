package schneider.tictactoe.userservice.service;

import schneider.tictactoe.userservice.dto.CreateGameDto;
import schneider.tictactoe.userservice.dto.LeaderboardDto;
import schneider.tictactoe.userservice.dto.UserRankDto;

import java.util.List;

public interface GameService {
    CreateGameDto createGame(CreateGameDto createGameDto);

    List<UserRankDto> getLeaderboard();
}
