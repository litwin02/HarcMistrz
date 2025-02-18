package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.Models.EventParticipation;
import umg.harcmistrz.Models.ScoutInTeam;
import umg.harcmistrz.Models.User;
import umg.harcmistrz.dto.EventParticipationDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.repository.EventParticipationRepository;
import umg.harcmistrz.repository.EventRepository;
import umg.harcmistrz.repository.ScoutInTeamRepository;
import umg.harcmistrz.requests.NewEventParticipationRequest;
import umg.harcmistrz.service.EventParticipationService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventParticipationServiceUnitTest {
    @Mock
    private EventParticipationRepository eventParticipationRepository;

    @Mock
    private ScoutInTeamRepository scoutInTeamRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventParticipationService eventParticipationService;

    @Test
    void getEventParticipationByScoutId_ReturnsListOfEventParticipationDTOs() {
        Long eventId = 1L;
        EventParticipation eventParticipation = new EventParticipation();
        eventParticipation.setId(1L);

        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setId(1L);

        User scout = new User();
        Long scoutId = 1L;
        scout.setId(scoutId);
        scoutInTeam.setScout(scout);

        eventParticipation.setScoutInTeam(scoutInTeam);
        Event event = new Event();
        event.setId(eventId);
        eventParticipation.setEvent(event);

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));
        when(eventParticipationRepository.findByScoutInTeamId(scoutInTeam.getId())).thenReturn(List.of(eventParticipation));

        List<EventParticipationDTO> result = eventParticipationService.getEventParticipationByScoutId(scoutId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(eventParticipation.getId(), result.get(0).getId());
    }

    @Test
    void getEventParticipationByEventId_ReturnsListOfEventParticipationDTOs() {
        Long eventId = 1L;
        EventParticipation eventParticipation = new EventParticipation();
        eventParticipation.setId(1L);

        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setId(1L);

        User scout = new User();
        scout.setId(1L);
        scoutInTeam.setScout(scout);

        eventParticipation.setScoutInTeam(scoutInTeam);
        Event event = new Event();
        event.setId(eventId);
        eventParticipation.setEvent(event);


        when(eventParticipationRepository.findByEventId(eventId)).thenReturn(List.of(eventParticipation));

        List<EventParticipationDTO> result = eventParticipationService.getEventParticipationByEventId(eventId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(eventParticipation.getId(), result.get(0).getId());
    }

    @Test
    void addNewEventParticipation_ReturnsSuccessMessage_WhenScoutAndEventExist() {
        Long scoutId = 1L;
        Long eventId = 1L;
        NewEventParticipationRequest request = new NewEventParticipationRequest(scoutId, eventId);
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        Event event = new Event();

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        MessageResponse response = eventParticipationService.addNewEventParticipation(request);

        assertTrue(response.isSuccess());
        assertEquals("Zostałeś dodany do wydarzenia!", response.getMessage());
        verify(eventParticipationRepository, times(1)).save(any(EventParticipation.class));
    }

    @Test
    void addNewEventParticipation_ReturnsErrorMessage_WhenScoutDoesNotExist() {
        Long scoutId = 1L;
        Long eventId = 1L;
        NewEventParticipationRequest request = new NewEventParticipationRequest(scoutId, eventId);

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of());

        MessageResponse response = eventParticipationService.addNewEventParticipation(request);

        assertFalse(response.isSuccess());
        assertEquals("Nie znaleziono harcerza w drużynie.", response.getMessage());
        verify(eventParticipationRepository, never()).save(any(EventParticipation.class));
    }

    @Test
    void addNewEventParticipation_ReturnsErrorMessage_WhenEventDoesNotExist() {
        Long scoutId = 1L;
        Long eventId = 1L;
        NewEventParticipationRequest request = new NewEventParticipationRequest(scoutId, eventId);

        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setId(1L);
        User scout = new User();
        scout.setId(scoutId);
        scoutInTeam.setScout(scout);

        when(scoutInTeamRepository.findByScoutId(scoutId)).thenReturn(List.of(scoutInTeam));
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        MessageResponse response = eventParticipationService.addNewEventParticipation(request);

        assertFalse(response.isSuccess());
        assertEquals("Nie znaleziono wydarzenia.", response.getMessage());
        verify(eventParticipationRepository, never()).save(any(EventParticipation.class));
    }

    @Test
    void deleteEventParticipation_ReturnsSuccessMessage_WhenEventParticipationExists() {
        Long eventParticipationId = 1L;

        MessageResponse response = eventParticipationService.deleteEventParticipation(eventParticipationId);

        assertTrue(response.isSuccess());
        assertEquals("Usunięto uczestnictwo w wydarzeniu.", response.getMessage());
        verify(eventParticipationRepository, times(1)).deleteById(eventParticipationId);
    }

    @Test
    void deleteEventParticipation_ReturnsErrorMessage_WhenEventParticipationDoesNotExist() {
        Long eventParticipationId = 1L;
        doThrow(new RuntimeException()).when(eventParticipationRepository).deleteById(eventParticipationId);

        MessageResponse response = eventParticipationService.deleteEventParticipation(eventParticipationId);

        assertFalse(response.isSuccess());
        assertEquals("Usunięcie uczestnictwa w wydarzeniu nie powiodło się.", response.getMessage());
        verify(eventParticipationRepository, times(1)).deleteById(eventParticipationId);
    }
}
