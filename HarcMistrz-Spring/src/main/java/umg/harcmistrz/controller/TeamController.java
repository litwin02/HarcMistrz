package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.dto.*;

import umg.harcmistrz.requests.AddScoutToTeamRequest;
import umg.harcmistrz.requests.CreateTeamRequest;
import umg.harcmistrz.service.TeamService;

import java.util.List;

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
        String message = wasAttemptSuccessful ? "Dołączyłeś do drużyny!" : "Jesteś już w tej drużynie lub należysz do innej drużyny!";
        return ResponseEntity.ok(new MessageResponse(message, wasAttemptSuccessful));
    }

    @GetMapping("/getTeamByTeamLeaderId/{teamLeaderId}")
    public ResponseEntity<TeamDTO> getTeamByTeamLeaderId(@PathVariable Long teamLeaderId) {
        Team team = teamService.getTeamByTeamLeaderId(teamLeaderId);
        return getTeamResponseResponseEntity(team);
    }

    @GetMapping("/getTeamByScoutId/{scoutId}")
    public ResponseEntity<TeamDTO> getTeamByScoutId(@PathVariable Long scoutId) {
        Team team = teamService.getTeamByScoutId(scoutId);
        return getTeamResponseResponseEntity(team);
    }

    @GetMapping("/getTeamMembers/{teamId}")
    public ResponseEntity<List<TeamMemberDTO>> getTeamMembers(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamMembers(teamId));
    }

    @DeleteMapping("/remove/{scoutId}/from/{teamId}")
    public ResponseEntity<MessageResponse> removeScoutFromTeam(@PathVariable Long scoutId, @PathVariable Long teamId) {
        String message = teamService.removeScoutFromTeam(scoutId, teamId);
        return ResponseEntity.ok(new MessageResponse(message, true));
    }

    @PutMapping("/updateTeamName/{teamId}")
    public ResponseEntity<MessageResponse> updateTeamName(@PathVariable Long teamId, @RequestBody String teamName) {
        String message = teamService.updateTeamName(teamId, teamName);
        return ResponseEntity.ok(new MessageResponse(message, true));
    }

    @DeleteMapping("/deleteTeam/{teamId}")
    public ResponseEntity<MessageResponse> deleteTeam(@PathVariable Long teamId) {
        String message = teamService.deleteTeam(teamId);
        return ResponseEntity.ok(new MessageResponse(message, true));
    }

    @GetMapping("/getAllTeams")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams().stream().map(team -> TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .joinCode(team.getJoinCode())
                .teamLeaderId(team.getTeamLeader().getId())
                .teamLeaderName(team.getTeamLeader().getFirstName() + " " + team.getTeamLeader().getLastName())
                .build()).toList());
    }

    @GetMapping("/getTeamById/{teamId}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long teamId) {
        Team team = teamService.getTeamById(teamId);
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
