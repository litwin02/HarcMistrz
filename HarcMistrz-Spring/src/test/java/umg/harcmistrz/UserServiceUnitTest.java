package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.UserDTO;
import umg.harcmistrz.repository.UserRepository;
import umg.harcmistrz.requests.UpdateUserRequest;
import umg.harcmistrz.service.UserService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserById_ReturnsUser_WhenUserExists() {
        Long userId = 1L;
        User user = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password" , Role.SCOUT);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        User result = userService.getUserById(userId);

        assertNotNull(result);
        assertEquals(userId, result.getId());
    }

    @Test
    void getUserById_ReturnsNull_WhenUserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        User result = userService.getUserById(userId);

        assertNull(result);
    }

    @Test
    void getUserDTOById_ReturnsUserDTO_WhenUserExists() {
        Long userId = 1L;
        User user = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password" , Role.SCOUT);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserDTO result = userService.getUserDTOById(userId);

        assertNotNull(result);
        assertEquals(userId, result.getId());
    }

    @Test
    void getUserDTOById_ReturnsNull_WhenUserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        UserDTO result = userService.getUserDTOById(userId);

        assertNull(result);
    }

    @Test
    void updateUser_UpdatesUser_WhenUserExists() {
        Long userId = 1L;
        UpdateUserRequest request = new UpdateUserRequest("John", "Doe", "john.doe@example.com", "123456789");
        User user = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password" , Role.SCOUT);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        MessageResponse response = userService.updateUser(userId, request);

        assertTrue(response.isSuccess());
        assertEquals("Dane użytkownika zostały zaktualizowane.", response.getMessage());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void updateUser_ReturnsErrorMessage_WhenUserDoesNotExist() {
        Long userId = 1L;
        UpdateUserRequest request = new UpdateUserRequest("John", "Doe", "john.doe@example.com", "123456789");

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        MessageResponse response = userService.updateUser(userId, request);

        assertFalse(response.isSuccess());
        assertEquals("Nie znaleziono użytkownika.", response.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_DeletesUser_WhenUserExists() {
        Long userId = 1L;
        User user = new User(userId, "John", "Doe", "john.doe@example.com", "123456789", "password" , Role.SCOUT);


        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        MessageResponse response = userService.deleteUser(userId);

        assertTrue(response.isSuccess());
        assertEquals("Użytkownik został usunięty.", response.getMessage());
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void deleteUser_ReturnsErrorMessage_WhenUserDoesNotExist() {
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        MessageResponse response = userService.deleteUser(userId);

        assertFalse(response.isSuccess());
        assertEquals("Nie znaleziono użytkownika.", response.getMessage());
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void getAllUsers_ReturnsListOfUsers() {
        User user1 = new User(1L, "John", "Doe", "john.doe@example.com", "123456789", "password",  Role.SCOUT);
        User user2 = new User(2L, "Jane", "Smith", "jane.smith@example.com", "987654321", "password" ,Role.SCOUT);

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        List<User> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void getAllAdminsDTOs_ReturnsListOfAdminDTOs() {
        User admin1 = new User(1L, "Admin", "One", "admin.one@example.com", "123456789", "password" , Role.ADMIN);
        User admin2 = new User(2L, "Admin", "Two", "admin.two@example.com", "987654321", "password" , Role.ADMIN);

        when(userRepository.findAllByRole(Role.ADMIN)).thenReturn(Optional.of(List.of(admin1, admin2)));

        List<UserDTO> result = userService.getAllAdminsDTOs();

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}