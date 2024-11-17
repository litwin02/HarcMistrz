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
@Entity(name = "team_scouts")
public class ScoutInTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_Id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "scout_Id", nullable = false)
    private User scout;

}
