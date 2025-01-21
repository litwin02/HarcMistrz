package umg.harcmistrz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.repository.UserRepository;
import umg.harcmistrz.requests.UpdateUserRequest;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserDTO getUserDTOById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }

    public MessageResponse updateUser(Long id, UpdateUserRequest request){
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new MessageResponse("Nie znaleziono użytkownika.", false);
        }
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);
        return new MessageResponse("Dane użytkownika zostały zaktualizowane.", true);
    }

    public MessageResponse deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new MessageResponse("Nie znaleziono użytkownika.", false);
        }
        userRepository.delete(user);
        return new MessageResponse("Użytkownik został usunięty.", true);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<UserDTO> getAllAdminsDTOs() {
        Optional<List<User>> users = userRepository.findAllByRole(Role.ADMIN);
        return users.map(userList -> userList.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .role(user.getRole())
                        .build())
                .collect(java.util.stream.Collectors.toList())).orElse(null);
    }
}
