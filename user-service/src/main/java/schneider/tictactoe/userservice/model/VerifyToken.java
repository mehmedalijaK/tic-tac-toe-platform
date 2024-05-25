package schneider.tictactoe.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verify_tokens")
@Data
@NoArgsConstructor
@Builder
public class VerifyToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "verify_token", unique = true, nullable = false)
    public String verifyToken;

    @PrePersist
    public void generateVerifyToken() {
        if (verifyToken == null) {
            verifyToken = UUID.randomUUID().toString();
        }
    }

    @Column
    public boolean revoked;

    @Column(nullable = false)
    public String username;

    @Column
    public LocalDateTime dateValidTo;

    public VerifyToken(Long id, String verifyToken, boolean revoked, String username, LocalDateTime dateValidTo) {
        this.id = id;
        this.verifyToken = verifyToken;
        this.revoked = revoked;
        this.username = username;
        this.dateValidTo = dateValidTo;
    }
}
