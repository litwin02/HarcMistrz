package umg.harcmistrz.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    @JoinColumn(name = "team_leader_id", nullable = false)
    private User teamLeader;

    @Column(unique = true, name = "join_code")
    private String joinCode;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<ScoutInTeam> scouts;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Event> events;

}
