package schneider.tictactoe.userservice.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Setter
@Table(name = "game-participant")
public class GameParticipant {
    @EmbeddedId
    private UserGameId id;
}
