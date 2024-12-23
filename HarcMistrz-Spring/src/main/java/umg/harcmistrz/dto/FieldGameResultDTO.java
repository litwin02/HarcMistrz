package umg.harcmistrz.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FieldGameResultDTO {
    private Long fieldGameId;
    private Long scoutId;
    private String firstName;
    private String lastName;
    private String email;
    private int points;
}
