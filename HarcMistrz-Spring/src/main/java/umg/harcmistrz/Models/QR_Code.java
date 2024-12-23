package umg.harcmistrz.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "qr_codes")
public class QR_Code {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "field_game_id")
    private FieldGame fieldGame;
    private UUID qrCode;
    private int points;
    private boolean scanned;
    private String description;

    @OneToOne(mappedBy = "qrCode", cascade = CascadeType.ALL)
    private QR_Scan qrScan;
}
