package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QR_CodeDTO {
    private Long id;
    private Long fieldGameId;
    private UUID qrCode;
    private int points;
    private Boolean scanned;
    private String description;
}
