package umg.harcmistrz.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "field_games")
public class FieldGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Boolean isActivated;

    @OneToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @OneToMany(mappedBy = "fieldGame", cascade = CascadeType.ALL)
    private List<QR_Code> qrCodes;
}
