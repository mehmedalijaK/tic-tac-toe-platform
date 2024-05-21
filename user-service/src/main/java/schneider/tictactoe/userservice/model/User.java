package schneider.tictactoe.userservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "score", nullable = false)
    private int score = 0;

    public User(Long id, String username, String password, String email, int score) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.score = score;
    }
}
