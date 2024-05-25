package schneider.tictactoe.userservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tokens")
@Data
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;

    @Column(unique = true)
    public String token;

    @Column
    public boolean revoked;

    @Column
    public boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User usersDetails;

    public Token() {
    }

    public Token(long id, String token, boolean revoked, boolean expired, User usersDetails) {
        this.id = id;
        this.token = token;
        this.revoked = revoked;
        this.expired = expired;
        this.usersDetails = usersDetails;
    }
}