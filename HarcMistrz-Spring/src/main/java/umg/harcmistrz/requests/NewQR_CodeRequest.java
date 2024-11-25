package umg.harcmistrz.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewQR_CodeRequest {
    private Long fieldGameId;
    private int points;
    private String description;
}
