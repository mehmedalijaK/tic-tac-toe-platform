package schneider.tictactoe.userservice.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "duration", nullable = false)
    private int duration = 0;

    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id")
    private User user;

    public Game(Long id, LocalDateTime date, int duration, User user) {
        this.id = id;
        this.date = date;
        this.duration = duration;
        this.user = user;
    }
}
