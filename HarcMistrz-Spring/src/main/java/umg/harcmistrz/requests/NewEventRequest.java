package umg.harcmistrz.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewEventRequest {
    private String name;
    private String description;
    private OffsetDateTime date;
    private String location;
    private Long teamId;
}
