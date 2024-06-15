package schneider.tictactoe.userservice.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Data
@Builder
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "winner_id")
    private User winner;

    @ManyToOne(optional = false)
    @JoinColumn(name = "loser_id")
    private User loser;

    public Game(Long id, LocalDateTime date, User winner, User loser) {
        this.id = id;
        this.date = date;
        this.winner = winner;
        this.loser = loser;
    }
}
