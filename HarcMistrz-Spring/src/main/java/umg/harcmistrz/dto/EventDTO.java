package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private OffsetDateTime date;
    private String location;
    private Long teamId;
}
