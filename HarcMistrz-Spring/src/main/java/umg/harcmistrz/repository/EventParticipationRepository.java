package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.EventParticipation;

import java.util.List;

public interface EventParticipationRepository extends JpaRepository<EventParticipation, Long> {
    List<EventParticipation> findByScoutInTeamId(Long scoutInTeamId);
    List<EventParticipation> findByEventId(Long eventId);
}
