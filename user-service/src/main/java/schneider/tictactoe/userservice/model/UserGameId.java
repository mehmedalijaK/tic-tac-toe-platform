package schneider.tictactoe.userservice.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.MapsId;
import lombok.Getter;

@Getter
@Embeddable
public class UserGameId {
    @MapsId
    private Long userId;
    @MapsId
    private Long gameId;

    public UserGameId(Long userId, Long gameId) {
        this.userId = userId;
        this.gameId = gameId;
    }
}
