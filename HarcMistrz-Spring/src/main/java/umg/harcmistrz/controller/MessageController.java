package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageDTO;
import umg.harcmistrz.requests.NewMessageRequest;
import umg.harcmistrz.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping
    public List<MessageDTO> getAllMessages() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return messageService.getAllMessages(user.getId());
    }

    @GetMapping("/{otherUserId}")
    public List<MessageDTO> getConversation(@PathVariable Long otherUserId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return messageService.getConversation(user.getId(), otherUserId);
    }

    @PostMapping
    public MessageDTO sendMessage(@RequestBody NewMessageRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return messageService.sendMessage(user.getId(), request);
    }
}
