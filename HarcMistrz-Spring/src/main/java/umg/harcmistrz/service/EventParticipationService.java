package umg.harcmistrz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.Event;
import umg.harcmistrz.Models.EventParticipation;
import umg.harcmistrz.dto.EventParticipationDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.repository.EventParticipationRepository;
import umg.harcmistrz.repository.EventRepository;
import umg.harcmistrz.repository.ScoutInTeamRepository;
import umg.harcmistrz.requests.NewEventParticipationRequest;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventParticipationService {
    @Autowired
    private EventParticipationRepository eventParticipationRepository;
    @Autowired
    private ScoutInTeamRepository scoutInTeamRepository;
    @Autowired
    private EventRepository eventRepository;

    public List<EventParticipationDTO> getEventParticipationByScoutId(Long scoutId) {
        List<EventParticipation> eventParticipation = eventParticipationRepository
                .findByScoutInTeamId(scoutInTeamRepository.findByScoutId(scoutId).getFirst().getId());
        return getEventParticipationDTOS(eventParticipation);
    }

    public List<EventParticipationDTO> getEventParticipationByEventId(Long eventId) {
        List<EventParticipation> eventParticipation = eventParticipationRepository.findByEventId(eventId);
        return getEventParticipationDTOS(eventParticipation);
    }

    public MessageResponse addNewEventParticipation(NewEventParticipationRequest newEventParticipationRequest) {
        EventParticipation eventParticipation = new EventParticipation();
        try {
            eventParticipation.setScoutInTeam(
                    scoutInTeamRepository.findByScoutId(newEventParticipationRequest.getScoutId()).getFirst());
        } catch (Exception e) {
            return new MessageResponse("Nie znaleziono harcerza w drużynie.");
        }
        try {
            eventParticipation.setEvent(eventRepository.findById(newEventParticipationRequest.getEventId()).orElse(null));
        } catch (Exception e) {
            return new MessageResponse("Nie znaleziono wydarzenia.");
        }
        eventParticipationRepository.save(eventParticipation);

        return new MessageResponse("Zostałeś dodany do wydarzenia!");
    }

    public MessageResponse deleteEventParticipation(Long eventParticipationId) {
        try {
            eventParticipationRepository.deleteById(eventParticipationId);
        } catch (Exception e) {
            return new MessageResponse("Usunięcie uczestnictwa w wydarzeniu nie powiodło się.");
        }
        return new MessageResponse("Usunięto uczestnictwo w wydarzeniu.");
    }

    // PRIVATE METHODS

    private List<EventParticipationDTO> getEventParticipationDTOS(List<EventParticipation> eventParticipations) {
        List<EventParticipationDTO> eventParticipationDTOS = new ArrayList<>();

        for (EventParticipation eventParticipation : eventParticipations) {
            eventParticipationDTOS.add(EventParticipationDTO.builder()
                    .id(eventParticipation.getId())
                    .scoutInTeamId(eventParticipation.getScoutInTeam().getScout().getId())
                    .eventId(eventParticipation.getEvent().getId())
                    .build());
        }
        return eventParticipationDTOS;
    }
}