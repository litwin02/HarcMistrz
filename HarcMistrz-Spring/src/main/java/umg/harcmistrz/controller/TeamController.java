package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.dto.*;

import umg.harcmistrz.requests.AddScoutToTeamRequest;
import umg.harcmistrz.requests.CreateTeamRequest;
import umg.harcmistrz.service.TeamService;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    //returns join code of new team
    @PostMapping("/createNewTeam")
    public ResponseEntity<String> createNewTeam(@RequestBody CreateTeamRequest createTeamRequest) {
        return ResponseEntity.ok(teamService.createTeam(createTeamRequest.getTeamLeaderId(), createTeamRequest.getTeamName()));
    }

    // find team by join code in order to verify if it exists, and if it is a correct team
    @PostMapping("/getTeamByJoinCode")
    public ResponseEntity<TeamDTO> getTeamByJoinCode(@RequestParam String joinCode) {
        Team team = teamService.getTeamByJoinCode(joinCode);
        return getTeamResponseResponseEntity(team);
    }

    @PostMapping("/joinTeam")
    public ResponseEntity<MessageResponse> joinTeam(@RequestBody AddScoutToTeamRequest addScoutToTeamRequest) {
        Team team = teamService.getTeamById(addScoutToTeamRequest.getTeamId());
        if(team == null) {
            return ResponseEntity.notFound().build();
        }
        boolean wasAttemptSuccessful = teamService.addScoutToTeam(addScoutToTeamRequest.getScoutId(), team);
        String message = wasAttemptSuccessful ? "Dodano harcerza do drużyny!" : "Harcerz jest już w tej drużynie lub należy do innej drużyny!";
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @GetMapping("/getTeamByTeamLeaderId/{teamLeaderId}")
    public ResponseEntity<TeamDTO> getTeamByTeamLeaderId(@PathVariable Long teamLeaderId) {
        Team team = teamService.getTeamByTeamLeaderId(teamLeaderId);
        return getTeamResponseResponseEntity(team);
    }

    // PRIVATE METHODS

    private ResponseEntity<TeamDTO> getTeamResponseResponseEntity(Team team) {
        if(team == null) {
            return ResponseEntity.notFound().build();
        }
        TeamDTO teamDTO = TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .joinCode(team.getJoinCode())
                .teamLeaderId(team.getTeamLeader().getId())
                .teamLeaderName(team.getTeamLeader().getFirstName() + " " + team.getTeamLeader().getLastName())
                .build();
        return ResponseEntity.ok(teamDTO);
    }



}
