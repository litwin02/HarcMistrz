package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import umg.harcmistrz.Models.Role;
import umg.harcmistrz.Models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<List<User>> findAllByRole(Role role);
}
