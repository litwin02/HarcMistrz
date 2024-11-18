package umg.harcmistrz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.dto.NewEventRequest;
import umg.harcmistrz.repository.EventRepository;

@RequiredArgsConstructor
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

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

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public void updateEvent(Long id, NewEventRequest newEventRequest) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            event.setName(newEventRequest.getName());
            event.setDescription(newEventRequest.getDescription());
            event.setDate(newEventRequest.getDate());
            event.setLocation(newEventRequest.getLocation());
            eventRepository.save(event);
        }
    }

}
