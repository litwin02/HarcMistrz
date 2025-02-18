package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.repository.EventRepository;
import umg.harcmistrz.repository.FieldGameRepository;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.requests.EditEventRequest;
import umg.harcmistrz.requests.NewEventRequest;
import umg.harcmistrz.service.EventService;
import umg.harcmistrz.service.TeamService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceUnitTest {
    @Mock
    private EventRepository eventRepository;

    @Mock
    private FieldGameRepository fieldGameRepository;

    @Mock
    private QR_CodeRepository qr_codeRepository;

    @Mock
    private TeamService teamService;

    @InjectMocks
    private EventService eventService;

    @Test
    void createNewEvent_SavesEvent() {
        NewEventRequest request = new NewEventRequest("Test Event", "Description", null, "Location", 1L);
        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());

        when(teamService.getTeamById(request.getTeamId())).thenReturn(null);

        eventService.createNewEvent(request);

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void getEventById_ReturnsEvent_WhenEventExists() {
        Long eventId = 1L;
        Event event = new Event();
        event.setId(eventId);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        Event result = eventService.getEventById(eventId);

        assertNotNull(result);
        assertEquals(eventId, result.getId());
    }

    @Test
    void getEventById_ReturnsNull_WhenEventDoesNotExist() {
        Long eventId = 1L;

        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        Event result = eventService.getEventById(eventId);

        assertNull(result);
    }

    @Test
    void deleteEvent_DeletesEvent_WhenEventExists() {
        Long eventId = 1L;
        FieldGame fieldGame = new FieldGame();
        fieldGame.setId(1L);

        when(fieldGameRepository.findByEventId(eventId)).thenReturn(fieldGame);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(new Event(eventId, "", "", OffsetDateTime.now(), "", null, fieldGame, null)));

        eventService.deleteEvent(eventId);

        verify(qr_codeRepository, times(1)).deleteAllByFieldGameId(fieldGame.getId());
        verify(fieldGameRepository, times(1)).deleteByEventId(eventId);
        verify(eventRepository, times(1)).delete(any(Event.class));
    }

    @Test
    void updateEvent_UpdatesEvent_WhenEventExists() {
        Long eventId = 1L;
        EditEventRequest request = new EditEventRequest(eventId, "Updated Name", "Updated Description", null, "Updated Location");
        Event event = new Event();
        event.setId(eventId);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        eventService.updateEvent(request);

        assertEquals(request.getName(), event.getName());
        assertEquals(request.getDescription(), event.getDescription());
        assertEquals(request.getLocation(), event.getLocation());
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void getEventsByTeamId_ReturnsListOfEvents() {
        Long teamId = 1L;
        Event event1 = new Event();
        event1.setId(1L);
        Event event2 = new Event();
        event2.setId(2L);

        when(eventRepository.getEventsByTeamId(teamId)).thenReturn(List.of(event1, event2));

        List<Event> result = eventService.getEventsByTeamId(teamId);

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}