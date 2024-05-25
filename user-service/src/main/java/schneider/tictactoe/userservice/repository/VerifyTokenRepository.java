package schneider.tictactoe.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import schneider.tictactoe.userservice.model.VerifyToken;

import java.util.Optional;

public interface VerifyTokenRepository extends JpaRepository<VerifyToken, Long> {
    Optional<VerifyToken> findVerifyTokenByVerifyToken(String token);
}