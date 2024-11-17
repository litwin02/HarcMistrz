package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.NewEventRequest;
import umg.harcmistrz.service.EventService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
