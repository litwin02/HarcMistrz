package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.Message;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageDTO;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.repository.MessageRepository;
import umg.harcmistrz.requests.NewMessageRequest;
import umg.harcmistrz.service.MessageService;
import umg.harcmistrz.service.TeamService;
import umg.harcmistrz.service.UserService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceUnitTest {
    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserService userService;

    @Mock
    private TeamService teamService;

    @InjectMocks
    private MessageService messageService;

    @Test
    void getAllMessages_ReturnsListOfMessages() {
        Long userId = 1L;
        Message message = new Message(1L, new User(), new User(), "Test message", OffsetDateTime.now());

        when(messageRepository.findAllBySenderIdOrRecipientIdOrderByTimestampDesc(userId, userId)).thenReturn(List.of(message));

        List<MessageDTO> result = messageService.getAllMessages(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(message.getId(), result.get(0).getId());
    }

    @Test
    void getConversation_ReturnsListOfMessages() {
        Long userId = 1L;
        Long otherUserId = 2L;
        Message message = new Message(1L, new User(), new User(), "Test message", OffsetDateTime.now());

        when(messageRepository.findAllBySenderIdAndRecipientIdOrderByTimestampAsc(userId, otherUserId)).thenReturn(List.of(message));
        when(messageRepository.findAllBySenderIdAndRecipientIdOrderByTimestampAsc(otherUserId, userId)).thenReturn(List.of());

        List<MessageDTO> result = messageService.getConversation(userId, otherUserId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(message.getId(), result.get(0).getId());
    }

    @Test
    void sendMessage_ReturnsMessageDTO_WhenMessageIsSent() {
        Long senderId = 1L;
        NewMessageRequest request = new NewMessageRequest(2L, "Test message");
        User sender = new User(senderId, "John", "Doe", "john.doe@example.com", "123456789", "password", Role.SCOUT);
        User recipient = new User(2L, "Jane", "Smith", "jane.smith@example.com", "987654321", "password", Role.SCOUT);
        Message message = new Message(1L, sender, recipient, "Test message", OffsetDateTime.now());

        when(userService.getUserById(senderId)).thenReturn(sender);
        when(userService.getUserById(request.getRecipientId())).thenReturn(recipient);
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        MessageDTO result = messageService.sendMessage(senderId, request);

        assertNotNull(result);
        assertEquals(message.getId(), result.getId());
    }

    @Test
    void getUsersToChatWith_ReturnsListOfUserDTOs_WhenUserIsAdmin() {
        Long userId = 1L;
        User admin = new User(userId, "Admin", "One", "admin.one@example.com", "123456789", "password", Role.ADMIN);
        User user = new User(2L, "John", "Doe", "john.doe@example.com", "123456789", "password", Role.SCOUT);
        UserDTO userDTO = UserDTO.builder().id(2L).build();

        when(userService.getUserById(userId)).thenReturn(admin);
        when(userService.getAllUsers()).thenReturn(List.of(admin, user));


        List<UserDTO> result = messageService.getUsersToChatWith(userId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userDTO.getId(), result.get(0).getId());
    }

    @Test
    void getUsersToChatWith_ReturnsListOfUserDTOs_WhenUserIsScout() {
        Long userId = 1L;
        User scout = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password", Role.SCOUT);
        User teamLeader = new User(2L, "Jane", "Smith", "j@s.com", "123456789", "password", Role.TEAM_LEADER);
        Team team = new Team();
        team.setId(1L);

        UserDTO adminDTO = UserDTO.builder().id(3L).build();
        team.setTeamLeader(teamLeader);

        when(userService.getUserById(userId)).thenReturn(scout);
        when(teamService.getTeamByScoutId(userId)).thenReturn(team);
        when(userService.getAllAdminsDTOs()).thenReturn(List.of(adminDTO));

        List<UserDTO> result = messageService.getUsersToChatWith(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getUsersToChatWith_ReturnsListOfUserDTOs_WhenUserIsTeamLeader() {
        Long userId = 1L;
        User teamLeader = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password", Role.TEAM_LEADER);
        Team team = new Team();
        team.setId(1L);
        UserDTO scoutDTO = UserDTO.builder().id(2L).build();
        UserDTO adminDTO = UserDTO.builder().id(3L).build();

        when(userService.getUserById(userId)).thenReturn(teamLeader);
        when(teamService.getTeamByTeamLeaderId(userId)).thenReturn(team);
        when(teamService.getAllTeamUsers(team.getId())).thenReturn(List.of(scoutDTO));
        when(userService.getAllAdminsDTOs()).thenReturn(List.of(adminDTO));

        List<UserDTO> result = messageService.getUsersToChatWith(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}