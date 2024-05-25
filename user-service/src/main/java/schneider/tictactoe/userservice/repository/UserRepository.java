package schneider.tictactoe.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import schneider.tictactoe.userservice.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u ORDER BY u.score DESC")
    Optional<User> findTopByOrderByScoreDesc();
    Optional<User> findByUsername(String username);
}
