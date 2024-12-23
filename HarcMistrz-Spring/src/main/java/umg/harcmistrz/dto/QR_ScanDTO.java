package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QR_ScanDTO {
    private Long id;
    private Long scoutId;
    private String firstName;
    private String lastName;
    private String email;
    private Long qrCodeId;
    private String scanTime;
    private int points;
}
