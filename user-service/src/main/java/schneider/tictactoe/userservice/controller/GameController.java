package schneider.tictactoe.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schneider.tictactoe.userservice.dto.CreateGameDto;
import schneider.tictactoe.userservice.dto.LeaderboardDto;
import schneider.tictactoe.userservice.dto.UserCreateDto;
import schneider.tictactoe.userservice.dto.UserRankDto;
import schneider.tictactoe.userservice.service.GameService;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/create")
    public ResponseEntity<CreateGameDto> createGame(@RequestHeader("Authorization") String authorization){
        return new ResponseEntity<>(gameService.createGame(), HttpStatus.OK);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<UserRankDto>> getLeaderboard(@RequestHeader("Authorization") String authorization){
        return new ResponseEntity<>(gameService.getLeaderboard(), HttpStatus.OK);
    }

}
