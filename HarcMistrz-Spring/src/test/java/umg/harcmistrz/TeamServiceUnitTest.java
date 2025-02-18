package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.ScoutInTeam;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.TeamMemberDTO;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.repository.ScoutInTeamRepository;
import umg.harcmistrz.repository.TeamRepository;
import umg.harcmistrz.service.TeamService;
import umg.harcmistrz.service.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceUnitTest {
    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ScoutInTeamRepository scoutInTeamRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TeamService teamService;

    @Test
    void getTeamById_ReturnsTeam_WhenTeamExists() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        Team result = teamService.getTeamById(teamId);

        assertNotNull(result);
        assertEquals(teamId, result.getId());
    }

    @Test
    void getTeamById_ReturnsNull_WhenTeamDoesNotExist() {
        Long teamId = 1L;

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        Team result = teamService.getTeamById(teamId);

        assertNull(result);
    }

    @Test
    void getTeamByJoinCode_ReturnsTeam_WhenJoinCodeExists() {
        String joinCode = "ABC123";
        Team team = new Team();
        team.setJoinCode(joinCode);

        when(teamRepository.findByJoinCode(joinCode)).thenReturn(team);

        Team result = teamService.getTeamByJoinCode(joinCode);

        assertNotNull(result);
        assertEquals(joinCode, result.getJoinCode());
    }

    @Test
    void getTeamByJoinCode_ReturnsNull_WhenJoinCodeDoesNotExist() {
        String joinCode = "ABC123";

        when(teamRepository.findByJoinCode(joinCode)).thenReturn(null);

        Team result = teamService.getTeamByJoinCode(joinCode);

        assertNull(result);
    }

    @Test
    void createTeam_ReturnsJoinCode_WhenTeamLeaderExists() {
        Long teamLeaderId = 1L;
        String teamName = "Test Team";
        User teamLeader = new User();
        teamLeader.setId(teamLeaderId);

        when(userService.getUserById(teamLeaderId)).thenReturn(teamLeader);
        when(teamRepository.save(any(Team.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String joinCode = teamService.createTeam(teamLeaderId, teamName);

        assertNotNull(joinCode);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void createTeam_ReturnsNull_WhenTeamLeaderDoesNotExist() {
        Long teamLeaderId = 1L;
        String teamName = "Test Team";

        when(userService.getUserById(teamLeaderId)).thenReturn(null);

        String joinCode = teamService.createTeam(teamLeaderId, teamName);

        assertNull(joinCode);
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void addScoutToTeam_ReturnsTrue_WhenScoutIsAdded() {
        Long scoutId = 1L;
        Team team = new Team();
        User scout = new User();
        scout.setId(scoutId);

        when(userService.getUserById(scoutId)).thenReturn(scout);
        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(Collections.emptyList());

        boolean result = teamService.addScoutToTeam(scoutId, team);

        assertTrue(result);
        verify(scoutInTeamRepository, times(1)).save(any(ScoutInTeam.class));
    }

    @Test
    void addScoutToTeam_ReturnsFalse_WhenScoutAlreadyInTeam() {
        Long scoutId = 1L;
        Team team = new Team();
        User scout = new User();
        scout.setId(scoutId);
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setScout(scout);

        when(userService.getUserById(scoutId)).thenReturn(scout);
        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));

        boolean result = teamService.addScoutToTeam(scoutId, team);

        assertFalse(result);
        verify(scoutInTeamRepository, never()).save(any(ScoutInTeam.class));
    }

    @Test
    void getTeamByScoutId_ReturnsTeam_WhenScoutIsInTeam() {
        Long scoutId = 1L;
        Team team = new Team();
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setTeam(team);

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));

        Team result = teamService.getTeamByScoutId(scoutId);

        assertNotNull(result);
        assertEquals(team, result);
    }

    @Test
    void getTeamByScoutId_ReturnsNull_WhenScoutIsNotInTeam() {
        Long scoutId = 1L;

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(Collections.emptyList());

        Team result = teamService.getTeamByScoutId(scoutId);

        assertNull(result);
    }

    @Test
    void removeScoutFromTeam_ReturnsSuccessMessage_WhenScoutIsRemoved() {
        Long scoutId = 1L;
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setTeam(team);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));

        String result = teamService.removeScoutFromTeam(scoutId, teamId);

        assertEquals("Usunięto harcerza z drużyny!", result);
        verify(scoutInTeamRepository, times(1)).delete(scoutInTeam);
    }

    @Test
    void removeScoutFromTeam_ReturnsErrorMessage_WhenTeamDoesNotExist() {
        Long scoutId = 1L;
        Long teamId = 1L;

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        String result = teamService.removeScoutFromTeam(scoutId, teamId);

        assertEquals("Nie ma takiej drużyny!", result);
        verify(scoutInTeamRepository, never()).delete(any(ScoutInTeam.class));
    }

    @Test
    void removeScoutFromTeam_ReturnsErrorMessage_WhenScoutIsNotInTeam() {
        Long scoutId = 1L;
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(Collections.emptyList());

        String result = teamService.removeScoutFromTeam(scoutId, teamId);

        assertEquals("Nie ma takiego harcerza!", result);
        verify(scoutInTeamRepository, never()).delete(any(ScoutInTeam.class));
    }

    @Test
    void removeScoutFromTeam_ReturnsErrorMessage_WhenScoutIsInDifferentTeam() {
        Long scoutId = 1L;
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);
        Team differentTeam = new Team();
        differentTeam.setId(2L);
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setTeam(differentTeam);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));

        String result = teamService.removeScoutFromTeam(scoutId, teamId);

        assertEquals("Ten harcerz nie należy do tej drużyny!", result);
        verify(scoutInTeamRepository, never()).delete(any(ScoutInTeam.class));
    }

    @Test
    void updateTeamName_ReturnsSuccessMessage_WhenTeamExists() {
        Long teamId = 1L;
        String newName = "New Team Name";
        Team team = new Team();
        team.setId(teamId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        String result = teamService.updateTeamName(teamId, newName);

        assertEquals("Zaktualizowano nazwę drużyny!", result);
        assertEquals(newName, team.getName());
        verify(teamRepository, times(1)).save(team);
    }

    @Test
    void updateTeamName_ReturnsErrorMessage_WhenTeamDoesNotExist() {
        Long teamId = 1L;
        String newName = "New Team Name";

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        String result = teamService.updateTeamName(teamId, newName);

        assertEquals("Nie ma takiej drużyny!", result);
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    void deleteTeam_ReturnsSuccessMessage_WhenTeamExists() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));

        String result = teamService.deleteTeam(teamId);

        assertEquals("Usunięto drużynę!", result);
        verify(teamRepository, times(1)).delete(team);
    }

    @Test
    void deleteTeam_ReturnsErrorMessage_WhenTeamDoesNotExist() {
        Long teamId = 1L;

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        String result = teamService.deleteTeam(teamId);

        assertEquals("Nie ma takiej drużyny!", result);
        verify(teamRepository, never()).delete(any(Team.class));
    }

    @Test
    void getAllTeams_ReturnsListOfTeams() {
        Team team1 = new Team();
        team1.setId(1L);
        Team team2 = new Team();
        team2.setId(2L);

        when(teamRepository.findAll()).thenReturn(List.of(team1, team2));

        List<Team> result = teamService.getAllTeams();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getAllTeamUsers_ReturnsListOfUserDTOs_WhenTeamExists() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        User scout = new User();
        scout.setId(1L);
        scoutInTeam.setScout(scout);
        scoutInTeam.setTeam(team);
        UserDTO userDTO = UserDTO.builder().id(1L).build();

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(scoutInTeamRepository.findByTeamId(teamId)).thenReturn(List.of(scoutInTeam));
        when(userService.getUserDTOById(1L)).thenReturn(userDTO);

        List<UserDTO> result = teamService.getAllTeamUsers(teamId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userDTO, result.get(0));
    }

    @Test
    void getAllTeamUsers_ReturnsNull_WhenTeamDoesNotExist() {
        Long teamId = 1L;

        when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

        List<UserDTO> result = teamService.getAllTeamUsers(teamId);

        assertNull(result);
    }

    @Test
    void getAllTeamUsers_ReturnsNull_WhenNoScoutsInTeam() {
        Long teamId = 1L;
        Team team = new Team();
        team.setId(teamId);

        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
        when(scoutInTeamRepository.findByTeamId(teamId)).thenReturn(Collections.emptyList());

        List<UserDTO> result = teamService.getAllTeamUsers(teamId);

        assertNull(result);
    }
}