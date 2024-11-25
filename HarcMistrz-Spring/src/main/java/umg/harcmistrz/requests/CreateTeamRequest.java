package umg.harcmistrz.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateTeamRequest {
    private long teamLeaderId;
    private String teamName;
}
