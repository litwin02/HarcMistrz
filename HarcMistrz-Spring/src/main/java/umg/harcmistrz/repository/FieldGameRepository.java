package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.FieldGame;

public interface FieldGameRepository extends JpaRepository<FieldGame, Long> {
    FieldGame findByEventId(Long eventId);
}
