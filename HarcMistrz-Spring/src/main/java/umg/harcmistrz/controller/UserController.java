package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.requests.UpdateUserRequest;
import umg.harcmistrz.service.UserService;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserDTOById(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<MessageResponse> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTO = new ArrayList<>();
        for (User user : users) {
            userDTO.add(UserDTO.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .phoneNumber(user.getPhoneNumber())
                    .role(user.getRole())
                    .build());
        }
        return ResponseEntity.ok(userDTO);
    }

}
