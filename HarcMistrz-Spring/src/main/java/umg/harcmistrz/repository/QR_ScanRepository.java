package umg.harcmistrz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import umg.harcmistrz.Models.QR_Scan;

import java.util.List;
import java.util.UUID;

@Repository
public interface QR_ScanRepository extends JpaRepository<QR_Scan, Long> {
}
