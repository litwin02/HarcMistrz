package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.Models.FieldGameStatus;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.repository.FieldGameRepository;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.requests.EditFieldGameRequest;
import umg.harcmistrz.requests.NewFieldGameRequest;
import umg.harcmistrz.service.EventService;
import umg.harcmistrz.service.FieldGameService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FieldGameServiceUnitTest {
    @Mock
    private EventService eventService;

    @Mock
    private FieldGameRepository fieldGameRepository;

    @Mock
    private QR_CodeRepository qr_codeRepository;

    @InjectMocks
    private FieldGameService fieldGameService;

    @Test
    void createNewFieldGame_SavesFieldGame() {
        NewFieldGameRequest request = new NewFieldGameRequest("Test Game", "Description", 1L);
        FieldGame fieldGame = new FieldGame();
        fieldGame.setName(request.getName());
        fieldGame.setDescription(request.getDescription());
        fieldGame.setStatus(FieldGameStatus.NOT_STARTED);

        when(eventService.getEventById(request.getEventId())).thenReturn(null);

        fieldGameService.createNewFieldGame(request);

        verify(fieldGameRepository, times(1)).save(any(FieldGame.class));
    }

    @Test
    void getFieldGameById_ReturnsFieldGame_WhenFieldGameExists() {
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        FieldGame result = fieldGameService.getFieldGameById(fieldGameId);

        assertNotNull(result);
        assertEquals(fieldGameId, result.getId());
    }

    @Test
    void getFieldGameById_ReturnsNull_WhenFieldGameDoesNotExist() {
        Long fieldGameId = 1L;

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.empty());

        FieldGame result = fieldGameService.getFieldGameById(fieldGameId);

        assertNull(result);
    }

    @Test
    void deleteFieldGame_DeletesFieldGame_WhenFieldGameExists() {
        Long fieldGameId = 1L;

        fieldGameService.deleteFieldGame(fieldGameId);

        verify(qr_codeRepository, times(1)).deleteAllByFieldGameId(fieldGameId);
        verify(fieldGameRepository, times(1)).deleteById(fieldGameId);
    }

    @Test
    void updateFieldGame_UpdatesFieldGame_WhenFieldGameExists() {
        Long fieldGameId = 1L;
        EditFieldGameRequest request = new EditFieldGameRequest(fieldGameId, "Updated Name", "Updated Description");
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        fieldGameService.updateFieldGame(request);

        assertEquals(request.getName(), fieldGame.getName());
        assertEquals(request.getDescription(), fieldGame.getDescription());
        verify(fieldGameRepository, times(1)).save(fieldGame);
    }

    @Test
    void activateFieldGame_ReturnsSuccessMessage_WhenFieldGameIsNotStarted() {
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);
        fieldGame.setStatus(FieldGameStatus.NOT_STARTED);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        MessageResponse response = fieldGameService.activateFieldGame(fieldGameId);

        assertTrue(response.isSuccess());
        assertEquals("Aktywowano grę terenową!", response.getMessage());
        assertEquals(FieldGameStatus.IN_PROGRESS, fieldGame.getStatus());
        verify(fieldGameRepository, times(1)).save(fieldGame);
    }

    @Test
    void activateFieldGame_ReturnsErrorMessage_WhenFieldGameIsInProgress() {
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);
        fieldGame.setStatus(FieldGameStatus.IN_PROGRESS);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        MessageResponse response = fieldGameService.activateFieldGame(fieldGameId);

        assertFalse(response.isSuccess());
        assertEquals("Gra terenowa jest już aktywna!", response.getMessage());
        verify(fieldGameRepository, never()).save(fieldGame);
    }

    @Test
    void deactivateFieldGame_ReturnsSuccessMessage_WhenFieldGameIsInProgress() {
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);
        fieldGame.setStatus(FieldGameStatus.IN_PROGRESS);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        MessageResponse response = fieldGameService.deactivateFieldGame(fieldGameId);

        assertTrue(response.isSuccess());
        assertEquals("Dezaktywowano grę terenową!", response.getMessage());
        assertEquals(FieldGameStatus.FINISHED, fieldGame.getStatus());
        verify(fieldGameRepository, times(1)).save(fieldGame);
    }

    @Test
    void deactivateFieldGame_ReturnsErrorMessage_WhenFieldGameIsFinished() {
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(fieldGameId);
        fieldGame.setStatus(FieldGameStatus.FINISHED);

        when(fieldGameRepository.findById(fieldGameId)).thenReturn(Optional.of(fieldGame));

        MessageResponse response = fieldGameService.deactivateFieldGame(fieldGameId);

        assertFalse(response.isSuccess());
        assertEquals("Gra terenowa jest już zakończona!", response.getMessage());
        verify(fieldGameRepository, never()).save(fieldGame);
    }
}