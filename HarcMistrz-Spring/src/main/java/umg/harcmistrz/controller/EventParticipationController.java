package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.dto.EventParticipationDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.requests.NewEventParticipationRequest;
import umg.harcmistrz.service.EventParticipationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/event-participation")
public class EventParticipationController {

    @Autowired
    private EventParticipationService eventParticipationService;

    @GetMapping("/getEventParticipationByScoutId/{scoutId}")
    public List<EventParticipationDTO> getEventParticipationByScoutId(@PathVariable Long scoutId) {
        return eventParticipationService.getEventParticipationByScoutId(scoutId);
    }

    @GetMapping("/getEventParticipationByEventId/{eventId}")
    public List<EventParticipationDTO> getEventParticipationByEventId(@PathVariable Long eventId) {
        return eventParticipationService.getEventParticipationByEventId(eventId);
    }

    @PostMapping("/addNewEventParticipation")
    public MessageResponse addNewEventParticipation(@RequestBody NewEventParticipationRequest request) {
        return eventParticipationService.addNewEventParticipation(request);
    }

    @DeleteMapping("/deleteEventParticipation/{eventParticipationId}")
    public MessageResponse deleteEventParticipation(@PathVariable Long eventParticipationId) {
        return eventParticipationService.deleteEventParticipation(eventParticipationId);
    }
}
