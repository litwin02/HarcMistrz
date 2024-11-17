package umg.harcmistrz.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.ScoutInTeam;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.repository.ScoutInTeamRepository;
import umg.harcmistrz.repository.TeamRepository;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ScoutInTeamRepository scoutInTeamRepository;

    public Team getTeamById(Long id) {
        return teamRepository.findById(id).orElse(null);
    }

    public Team getTeamByJoinCode(String joinCode) {
        return teamRepository.findByJoinCode(joinCode);
    }

    public String createTeam(long teamLeaderId, String teamName) {
        Team team = new Team();
        User teamLeader = userService.getUserById(teamLeaderId);
        if (teamLeader == null) {
            return null;
        }
        String joinCode;
        do {
            joinCode = generateUniqueJoinCode();
        } while (getTeamByJoinCode(joinCode) != null);

        team.setTeamLeader(teamLeader);
        team.setName(teamName);
        team.setJoinCode(joinCode);
        teamRepository.save(team);
        return joinCode;
    }

    public boolean addScoutToTeam(long scoutId, Team team) {
        User scout = userService.getUserById(scoutId);
        List<ScoutInTeam> scoutInTeam = scoutInTeamRepository.findByScoutId(scoutId);
        if (scout != null && scoutInTeam.isEmpty()) {
            ScoutInTeam newScout = new ScoutInTeam();
            newScout.setScout(scout);
            newScout.setTeam(team);
            scoutInTeamRepository.save(newScout);
            return true;
        }
        return false;
    }

    public Team getTeamByTeamLeaderId(long teamLeaderId) {
        return teamRepository.findByTeamLeaderId(teamLeaderId);
    }


    // PRIVATE METHODS

    private String generateUniqueJoinCode() {
        int length = 6;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder joinCode = new StringBuilder();
        while (joinCode.length() < length) {
            int index = (int) (Math.random() * characters.length());
            joinCode.append(characters.charAt(index));
        }
        return joinCode.toString();
    }
}
