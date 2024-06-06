package schneider.tictactoe.userservice.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import schneider.tictactoe.userservice.dto.AuthLoginDto;
import schneider.tictactoe.userservice.dto.AuthenticationResponseDto;
import schneider.tictactoe.userservice.dto.UserCreateDto;
import schneider.tictactoe.userservice.dto.UserDto;
import schneider.tictactoe.userservice.model.User;

public interface UserService {
    User findUsername(String username);
    void register(UserCreateDto userCreateDto);
    void verify(String id) throws Exception;
    AuthenticationResponseDto authenticate(AuthLoginDto authLoginDto);
    UserDto getMe(String authorization);
}
