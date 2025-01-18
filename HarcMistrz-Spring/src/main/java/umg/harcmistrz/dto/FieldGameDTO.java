package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import umg.harcmistrz.Models.FieldGameStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FieldGameDTO {
    private Long id;
    private String name;
    private String description;
    private FieldGameStatus status;
    private Long eventId;
}
