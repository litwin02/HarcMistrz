package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Team findByJoinCode(String joinCode);
    Team findByTeamLeaderId(long teamLeaderId);
}
