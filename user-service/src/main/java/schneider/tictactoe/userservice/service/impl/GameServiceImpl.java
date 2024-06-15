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
    public CreateGameDto createGame(CreateGameDto createGameDto) {
        Optional<User> userWinner = userRepository.findByUsername(createGameDto.getUsernameWinner());
        Optional<User> userLoser = userRepository.findByUsername(createGameDto.getUsernameLoser());
        if (userWinner.isPresent() && userLoser.isPresent()) {
            Game game = Game.builder()
                    .date(LocalDateTime.now())
                    .winner(userWinner.get())
                    .loser(userLoser.get())
                    .build();
            gameRepository.save(game);
            userWinner.get().setScore(userWinner.get().getScore() + 5);
            userLoser.get().setScore(Math.max( userLoser.get().getScore() - 5, 0));
            userRepository.save(userWinner.get());
            userRepository.save(userLoser.get());
            return null;
        } else {
            throw new RuntimeException("Winner or loser not found");
        }
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
