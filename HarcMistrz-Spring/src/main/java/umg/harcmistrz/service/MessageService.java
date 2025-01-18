package umg.harcmistrz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Message;
import umg.harcmistrz.dto.MessageDTO;
import umg.harcmistrz.repository.MessageRepository;
import umg.harcmistrz.requests.NewMessageRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    @Autowired
    private final MessageRepository messageRepository;

    @Autowired
    private final UserService userService;

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
        List<Message> messages = messageRepository.findAllBySenderIdAndRecipientIdOrRecipientIdAndSenderIdOrderByTimestampAsc(userId, otherUserId, otherUserId, userId);
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
        messageRepository.save(message);
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .recipientId(message.getRecipient().getId())
                .message(message.getMessage())
                .timestamp(message.getTimestamp())
                .build();
    }
}
