package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.EventDTO;
import umg.harcmistrz.requests.EditEventRequest;
import umg.harcmistrz.requests.NewEventRequest;
import umg.harcmistrz.service.EventService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/createNewEvent")
    public ResponseEntity<MessageResponse> createNewEvent(@RequestBody NewEventRequest newEventRequest) {
        eventService.createNewEvent(newEventRequest);
        return ResponseEntity.ok(new MessageResponse("Utworzono nowe wydarzenie!"));
    }

    @GetMapping("/getAllEventsByTeamId/{teamId}")
    public ResponseEntity<List<EventDTO>> getEventByTeamId(@PathVariable Long teamId) {
        List<Event> events = eventService.getEventsByTeamId(teamId);
        List<EventDTO> eventDTO = new ArrayList<>();
        for (Event event : events) {
            eventDTO.add(EventDTO.builder()
                    .id(event.getId())
                    .name(event.getName())
                    .description(event.getDescription())
                    .date(event.getDate())
                    .location(event.getLocation())
                    .teamId(event.getTeam().getId())
                    .build());
        }
        return ResponseEntity.ok(eventDTO);
    }

    @GetMapping("/getEventById/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(EventDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .teamId(event.getTeam().getId())
                .build());
    }

    @PutMapping("/updateEvent")
    public ResponseEntity<MessageResponse> updateEvent(@RequestBody EditEventRequest editEventRequest) {
        eventService.updateEvent(editEventRequest);
        return ResponseEntity.ok(new MessageResponse("Zaktualizowano wydarzenie!"));
    }

    @DeleteMapping("/deleteEvent/{id}")
    public ResponseEntity<MessageResponse> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new MessageResponse("Usunięto wydarzenie!"));
    }
}
