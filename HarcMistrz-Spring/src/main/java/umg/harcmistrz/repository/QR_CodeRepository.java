package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import umg.harcmistrz.Models.QR_Code;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface QR_CodeRepository extends JpaRepository<QR_Code, Long> {
    Optional<QR_Code> findByQrCode(UUID qrCode);
}
