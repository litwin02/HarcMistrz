package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}
