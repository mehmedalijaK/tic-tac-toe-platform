package schneider.tictactoe.userservice.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import schneider.tictactoe.userservice.dto.CreateGameDto;
import schneider.tictactoe.userservice.dto.LeaderboardDto;
import schneider.tictactoe.userservice.dto.UserRankDto;
import schneider.tictactoe.userservice.model.Game;
import schneider.tictactoe.userservice.model.User;
import schneider.tictactoe.userservice.repository.GameRepository;
import schneider.tictactoe.userservice.repository.UserRepository;
import schneider.tictactoe.userservice.service.GameService;

import javax.print.attribute.standard.MediaSize;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

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

    @Override
    public List<UserRankDto> getLeaderboard() {
        List<Optional<User>> users = userRepository.findTop10ByOrderByScoreDesc();
        return (users.stream()
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(this::convertToDto)
                .collect(Collectors.toList()));

    }

    private UserRankDto convertToDto(User user) {
        UserRankDto dto = new UserRankDto();
        dto.setUsername(user.getUsername());
        dto.setScore(user.getScore());
        return dto;
    }
}
