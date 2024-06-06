package schneider.tictactoe.userservice.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LeaderboardDto {
    public List<UserRankDto> leaderboard = new ArrayList<>();
}
