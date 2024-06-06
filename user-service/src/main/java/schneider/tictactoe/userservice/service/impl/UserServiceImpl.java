package schneider.tictactoe.userservice.service.impl;

import com.nimbusds.openid.connect.sdk.AuthenticationResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import schneider.tictactoe.userservice.dto.*;
import schneider.tictactoe.userservice.listener.MessageHelper;
import schneider.tictactoe.userservice.mapper.UserMapper;
import schneider.tictactoe.userservice.model.Role;
import schneider.tictactoe.userservice.model.Token;
import schneider.tictactoe.userservice.model.User;
import schneider.tictactoe.userservice.model.VerifyToken;
import schneider.tictactoe.userservice.repository.TokenRepository;
import schneider.tictactoe.userservice.repository.UserRepository;
import schneider.tictactoe.userservice.repository.VerifyTokenRepository;
import schneider.tictactoe.userservice.service.JwtService;
import schneider.tictactoe.userservice.service.UserService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final VerifyTokenRepository verifyTokenRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JmsTemplate jmsTemplate;
    @Value("${destination.sendEmails}")
    private String sendEmailDestination;
    private final TokenRepository tokenRepository;
    private final MessageHelper messageHelper;;

    @Override
    public User findUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow();
    }

    @Override
    public void register(UserCreateDto userCreateDto) {

        User user = userMapper.userCreateDtoToUser(userCreateDto);
        userRepository.save(user);

        VerifyToken verifyToken = VerifyToken.builder()
                .dateValidTo(LocalDateTime.now().plusDays(1))
                .revoked(false)
                .username(userCreateDto.getUsername()).build();

        verifyToken.generateVerifyToken();
        verifyTokenRepository.save(verifyToken);
        System.out.printf(verifyToken.getVerifyToken());

        HashMap<String, String> paramsMap = new HashMap<>();
        paramsMap.put("%username%", user.getUsername());
        paramsMap.put("%link%", "http://localhost:9090/api/user/verify/" + verifyToken.getVerifyToken());
        TransferDto transferDto = new TransferDto(user.getEmail(), "REGISTER_USER", paramsMap, user.getUsername());

        jmsTemplate.convertAndSend(sendEmailDestination, messageHelper.createTextMessage(transferDto));


    }

    public void verify(String id) throws Exception {
        Optional<VerifyToken> verifyToken = verifyTokenRepository.findVerifyTokenByVerifyToken(id);
        if(verifyToken.isEmpty()) throw new Exception("Verify token not found");
        VerifyToken verifyTokenF = verifyToken.get();

        if(verifyTokenF.isRevoked() || verifyTokenF.getDateValidTo().isBefore(LocalDateTime.now())) throw new Exception("Not valid token");

        verifyTokenF.setRevoked(true);
        verifyTokenRepository.save(verifyTokenF);
        Optional<User> user = userRepository.findByUsername(verifyTokenF.getUsername());
        if(user.isEmpty()) throw new Exception("User not found");

        user.get().setRole(Role.USER);
        userRepository.save(user.get());
    }

    @Override
    public AuthenticationResponseDto authenticate(AuthLoginDto authLoginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authLoginDto.getUsername(),
                        authLoginDto.getPassword()
                )
        );

        User user = findUsername(authLoginDto.getUsername());
        if(user.getRole().equals(Role.PENDING))
            return null;

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);

        AuthenticationResponseDto authenticationResponseDto = new AuthenticationResponseDto();
        authenticationResponseDto.setAccessToken(jwtToken);
        authenticationResponseDto.setRefreshToken(refreshToken);
        saveUserToken(user, refreshToken);

        HashMap<String, String> paramsMap = new HashMap<>();
        paramsMap.put("%username%", user.getUsername());
        TransferDto transferDto = new TransferDto(user.getEmail(), "LOGIN_USER", paramsMap, user.getUsername());

        jmsTemplate.convertAndSend(sendEmailDestination, messageHelper.createTextMessage(transferDto));

//        mail for login

        return authenticationResponseDto;
    }

    @Override
    public UserDto getMe(String authorization) {
        String token = authorization.substring(7);
        Optional<User> user = userRepository.findByUsername(jwtService.extractUsername(token));
        if(user.isEmpty()) return null;
        return userMapper.userToUserDto(user.get());
    }

    private void revokeAllUserTokens(User user) { // TODO: transfer to JWT class
        var validUserTokens = tokenRepository.findAllValidTokenByUsersDetails(user);
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwt){ // TODO: transfer to JWT class
        Token token = new Token();
        token.setToken(jwt);
        token.setUsersDetails(user);
        token.setExpired(false);
        token.setRevoked(false);
        tokenRepository.save(token);
    }

}
