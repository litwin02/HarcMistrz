package umg.harcmistrz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Message;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.Team;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageDTO;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.repository.MessageRepository;
import umg.harcmistrz.requests.NewMessageRequest;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    @Autowired
    private final MessageRepository messageRepository;

    @Autowired
    private final UserService userService;

    @Autowired
    private final TeamService teamService;

    public List<MessageDTO> getAllMessages(Long userId) {
        List<Message> messages = messageRepository.findAllBySenderIdOrRecipientIdOrderByTimestampDesc(userId, userId);
        return messages.stream()
                .map(message -> MessageDTO.builder()
                        .id(message.getId())
                        .senderId(message.getSender().getId())
                        .recipientId(message.getRecipient().getId())
                        .message(message.getMessage())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    public List<MessageDTO> getConversation(Long userId, Long otherUserId) {
        List<Message> messages = new ArrayList<>();
        messages.addAll(messageRepository.findAllBySenderIdAndRecipientIdOrderByTimestampAsc(userId, otherUserId));
        messages.addAll(messageRepository.findAllBySenderIdAndRecipientIdOrderByTimestampAsc(otherUserId, userId));
        messages.sort(Comparator.comparing(Message::getTimestamp));
        return messages.stream()
                .map(message -> MessageDTO.builder()
                        .id(message.getId())
                        .senderId(message.getSender().getId())
                        .recipientId(message.getRecipient().getId())
                        .message(message.getMessage())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    public MessageDTO sendMessage(Long senderId, NewMessageRequest request) {
        Message message = new Message();
        message.setSender(userService.getUserById(senderId));
        message.setRecipient(userService.getUserById(request.getRecipientId()));
        message.setMessage(request.getMessage());
        message.setTimestamp(OffsetDateTime.now());
        messageRepository.save(message);
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .recipientId(message.getRecipient().getId())
                .message(message.getMessage())
                .timestamp(message.getTimestamp())
                .build();
    }

    public List<UserDTO> getUsersToChatWith(Long userId){
        User user = userService.getUserById(userId);
        if(user.getRole().equals(Role.ADMIN)){
            List<UserDTO> users = new java.util.ArrayList<>(userService.getAllUsers().stream()
                    .map(user1 -> UserDTO.builder()
                            .id(user1.getId())
                            .firstName(user1.getFirstName())
                            .lastName(user1.getLastName())
                            .email(user1.getEmail())
                            .phoneNumber(user1.getPhoneNumber())
                            .role(user1.getRole())
                            .build())
                    .toList());

            // remove user calling endpoint from the list
            UserDTO userToDelete = users.stream().filter(user1 -> user1.getId().equals(userId)).findFirst().orElse(null);
            users.remove(userToDelete);
            return users;
        }
        else if(user.getRole().equals(Role.SCOUT)){
            Team team = teamService.getTeamByScoutId(userId);
            List<UserDTO> users = new ArrayList<>(teamService.getAllTeamUsers(team.getId()));

            // remove user calling endpoint from the list
            UserDTO userToDelete = users.stream().filter(user1 -> user1.getId().equals(userId)).findFirst().orElse(null);
            users.remove(userToDelete);

            // add team leader to the list
            users.add(UserDTO.builder()
                    .id(team.getTeamLeader().getId())
                    .firstName(team.getTeamLeader().getFirstName())
                    .lastName(team.getTeamLeader().getLastName())
                    .email(team.getTeamLeader().getEmail())
                    .phoneNumber(team.getTeamLeader().getPhoneNumber())
                    .role(team.getTeamLeader().getRole())
                    .build());

            // add admin to the list
            List<UserDTO> admins = userService.getAllAdminsDTOs();
            users.addAll(admins);
            return users;
        }
        else if(user.getRole().equals(Role.TEAM_LEADER))
        {
            Team team = teamService.getTeamByTeamLeaderId(userId);
            List<UserDTO> users = new ArrayList<>(teamService.getAllTeamUsers(team.getId()));

            // add admin to the list
            List<UserDTO> admins = userService.getAllAdminsDTOs();
            users.addAll(admins);
            return users;
        }
        return null;
    }
}
