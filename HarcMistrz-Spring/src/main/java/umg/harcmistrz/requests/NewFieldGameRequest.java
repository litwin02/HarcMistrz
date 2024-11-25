package umg.harcmistrz.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NewFieldGameRequest {
    private String name;
    private String description;
    private Long eventId;
}
