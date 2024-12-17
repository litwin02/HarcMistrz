package umg.harcmistrz.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "event_participation")
public class EventParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "scout_in_team_id")
    private ScoutInTeam scoutInTeam;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

}


