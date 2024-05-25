package schneider.tictactoe.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schneider.tictactoe.userservice.dto.CreateGameDto;
import schneider.tictactoe.userservice.dto.UserCreateDto;
import schneider.tictactoe.userservice.service.GameService;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/create")
    public ResponseEntity<CreateGameDto> createGame(@RequestHeader("Authorization") String authorization){
        return new ResponseEntity<>(gameService.createGame(), HttpStatus.OK);
    }

}
