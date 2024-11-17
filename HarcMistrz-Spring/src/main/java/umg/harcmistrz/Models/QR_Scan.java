package umg.harcmistrz.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "qr_scans")
public class QR_Scan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "scout_id")
    private ScoutInTeam scout;

    @OneToOne
    @JoinColumn(name = "qr_code_id")
    private QR_Code qrCode;
    private Date date;
    private int points;

}
