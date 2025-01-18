package umg.harcmistrz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private String message;
    private OffsetDateTime timestamp;
}
