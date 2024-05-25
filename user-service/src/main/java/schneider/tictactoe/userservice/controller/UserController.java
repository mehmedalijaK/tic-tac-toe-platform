package schneider.tictactoe.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import schneider.tictactoe.userservice.dto.AuthLoginDto;
import schneider.tictactoe.userservice.dto.AuthenticationResponseDto;
import schneider.tictactoe.userservice.dto.UserCreateDto;
import schneider.tictactoe.userservice.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Void> saveUser(@RequestBody @Valid UserCreateDto userCreateDto){
        userService.register(userCreateDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/verify/{id}")
    public String verifyUser(@PathVariable("id") String id) throws Exception {
        userService.verify(id);
        return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Account Verification</title><style>body {font-family: Arial, sans-serif;background-color: #f4f4f4;color: #333;text-align: center;margin: 50px;}h1 {color: #007bff;}</style></head><body><div><h1>Account Verification Successful</h1><p>Your account has been successfully verified. Thank you!</p></div></body></html>";
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> authenticate(@RequestBody @Valid AuthLoginDto authLoginDto){
        return new ResponseEntity<>(userService.authenticate(authLoginDto), HttpStatus.OK);
    }

}
