package schneider.tictactoe.userservice.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import schneider.tictactoe.userservice.dto.UserCreateDto;
import schneider.tictactoe.userservice.dto.UserDto;
import schneider.tictactoe.userservice.model.Role;
import schneider.tictactoe.userservice.model.User;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public User userCreateDtoToUser(UserCreateDto userCreateDto){
        User user = new User();
        user.setEmail(userCreateDto.getEmail());
        user.setRole(Role.PENDING);
        user.setUsername(userCreateDto.getUsername());
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        user.setScore(0);
        return user;
    }

    public UserDto userToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        return userDto;
    }
}
