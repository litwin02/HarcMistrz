package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.Event;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    Event getEventByTeamId(Long teamId);
    List<Event> getEventsByTeamId(Long teamId);
}
