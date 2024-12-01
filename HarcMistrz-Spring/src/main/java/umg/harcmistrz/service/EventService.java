package umg.harcmistrz.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.EventDTO;
import umg.harcmistrz.repository.EventRepository;
import umg.harcmistrz.repository.FieldGameRepository;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.requests.EditEventRequest;
import umg.harcmistrz.requests.NewEventRequest;

import java.util.List;

@RequiredArgsConstructor
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private FieldGameRepository fieldGameRepository;

    @Autowired
    private QR_CodeRepository qr_codeRepository;

    @Autowired
    private TeamService teamService;

    public void createNewEvent(NewEventRequest newEventRequest) {
        Event event = new Event();
        event.setName(newEventRequest.getName());
        event.setDescription(newEventRequest.getDescription());
        event.setDate(newEventRequest.getDate());
        event.setLocation(newEventRequest.getLocation());
        event.setTeam(teamService.getTeamById(newEventRequest.getTeamId()));
        eventRepository.save(event);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public List<Event> getEventsByTeamId(Long teamId) {
        return eventRepository.getEventsByTeamId(teamId);
    }

    @Transactional
    public void deleteEvent(Long id) {
        FieldGame fieldGame = fieldGameRepository.findByEventId(id);
        if(fieldGame != null) {
            qr_codeRepository.deleteAllByFieldGameId(fieldGame.getId());
            fieldGameRepository.deleteByEventId(id);
        }
        eventRepository.findById(id).ifPresent(event -> eventRepository.delete(event));
    }

    public void updateEvent(EditEventRequest editEventRequest) {
        Event event = eventRepository.findById(editEventRequest.getId()).orElse(null);
        if (event != null) {
            event.setName(editEventRequest.getName());
            event.setDescription(editEventRequest.getDescription());
            event.setDate(editEventRequest.getDate());
            event.setLocation(editEventRequest.getLocation());
            eventRepository.save(event);
        }
    }

}
