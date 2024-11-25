package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.FieldGameDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.requests.NewFieldGameRequest;
import umg.harcmistrz.service.FieldGameService;

@RestController
@RequestMapping("/api/v1/fieldGames")
@RequiredArgsConstructor
public class FieldGameController {

    @Autowired
    private FieldGameService fieldGameService;

    @PostMapping("/createNewFieldGame")
    public ResponseEntity<MessageResponse> createNewFieldGame(@RequestBody NewFieldGameRequest newFieldGameRequest) {
        fieldGameService.createNewFieldGame(newFieldGameRequest);
        return ResponseEntity.ok(new MessageResponse("Utworzono nowe pole gry!"));
    }

    @GetMapping("/getFieldGameByEventId/{id}")
    public ResponseEntity<FieldGameDTO> getFieldGameByEventId(@PathVariable Long id) {
        FieldGame fieldGame = fieldGameService.getFieldGameByEventId(id);
        if(fieldGame == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(FieldGameDTO.builder()
                .id(fieldGame.getId())
                .name(fieldGame.getName())
                .description(fieldGame.getDescription())
                .isActivated(fieldGame.getIsActivated())
                .eventId(fieldGame.getEvent().getId())
                .build());
    }
}