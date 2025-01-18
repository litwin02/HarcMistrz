package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FieldGameScoutResultDTO {
    private Long fieldGameId;
    private Long scoutId;
    private int points;
    private int codeScannedCount;
    private boolean hasScoutWon;
    private int scoreboardPosition;
}
