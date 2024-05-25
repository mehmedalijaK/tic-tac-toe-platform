package schneider.tictactoe.userservice.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import schneider.tictactoe.userservice.dto.CreateGameDto;
import schneider.tictactoe.userservice.model.Game;
import schneider.tictactoe.userservice.repository.GameRepository;
import schneider.tictactoe.userservice.service.GameService;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;


    @Override
    public CreateGameDto createGame() {
        Game game = Game.builder()
                .date(LocalDateTime.now())
                .duration(0)
                .user(null)
                .build();

        Game savedGame = gameRepository.save(game);
        Long savedGameId = savedGame.getId();

        return CreateGameDto.builder().id(savedGameId).build();

    }
}
