package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import umg.harcmistrz.Models.FieldGame;

import java.util.List;

public interface FieldGameRepository extends JpaRepository<FieldGame, Long> {
    FieldGame findByEventId(Long eventId);
    List<FieldGame> findAllByEventId(Long eventId);
}
