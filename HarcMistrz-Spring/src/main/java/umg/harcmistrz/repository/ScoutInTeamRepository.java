package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.ScoutInTeam;
import umg.harcmistrz.Models.Team;

import java.util.List;

public interface ScoutInTeamRepository extends JpaRepository<ScoutInTeam, Long> {
    List<ScoutInTeam> findByTeamId(Long teamId);
    List<ScoutInTeam> findByScoutId(Long scoutId);
    List<ScoutInTeam> findAllByTeamId(Long teamId);
}
