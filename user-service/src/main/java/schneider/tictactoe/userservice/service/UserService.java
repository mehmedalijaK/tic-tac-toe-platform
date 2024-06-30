package schneider.tictactoe.userservice.service;

import schneider.tictactoe.userservice.dto.*;
import schneider.tictactoe.userservice.model.User;

public interface UserService {
    User findUsername(String username);
    void register(UserCreateDto userCreateDto);
    void verify(String id) throws Exception;
    AuthenticationResponseDto authenticate(AuthLoginDto authLoginDto);
    UserDto getMe(String authorization);
    GamesHistoryDto getMyGames(String authorization) throws Exception;
}
