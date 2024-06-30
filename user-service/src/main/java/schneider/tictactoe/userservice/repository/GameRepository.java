package schneider.tictactoe.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import schneider.tictactoe.userservice.model.Game;
import schneider.tictactoe.userservice.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("SELECT u FROM Game u WHERE u.winner = :userId OR u.loser = :userId")
    Optional<List<Game>> findGameByUserId(Long userId);
}
