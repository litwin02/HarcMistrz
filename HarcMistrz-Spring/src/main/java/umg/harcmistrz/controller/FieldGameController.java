package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.FieldGameDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.requests.EditFieldGameRequest;
import umg.harcmistrz.requests.NewFieldGameRequest;
import umg.harcmistrz.service.FieldGameService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/fieldGames")
@RequiredArgsConstructor
public class FieldGameController {

    @Autowired
    private FieldGameService fieldGameService;

    @PostMapping("/createNewFieldGame")
    public ResponseEntity<MessageResponse> createNewFieldGame(@RequestBody NewFieldGameRequest newFieldGameRequest) {
        fieldGameService.createNewFieldGame(newFieldGameRequest);
        return ResponseEntity.ok(new MessageResponse("Utworzono nową grę terenową!"));
    }

    @GetMapping("/getFieldGameById/{id}")
    public ResponseEntity<FieldGameDTO> getFieldGameById(@PathVariable Long id) {
        FieldGame fieldGame = fieldGameService.getFieldGameById(id);
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

    @GetMapping("/getAllFieldGamesByEventId/{eventId}")
    public ResponseEntity<List<FieldGameDTO>> getAllFieldGamesByEventId(@PathVariable Long eventId) {
        List<FieldGame> fieldGames = fieldGameService.getAllFieldGamesByEventId(eventId);
        return ResponseEntity.ok(fieldGames.stream()
                .map(fieldGame -> FieldGameDTO.builder()
                        .id(fieldGame.getId())
                        .name(fieldGame.getName())
                        .description(fieldGame.getDescription())
                        .isActivated(fieldGame.getIsActivated())
                        .eventId(fieldGame.getEvent().getId())
                        .build())
                .collect(Collectors.toList()));
    }

    @PutMapping("/updateFieldGame")
    public ResponseEntity<MessageResponse> updateFieldGame(@RequestBody EditFieldGameRequest request) {
        fieldGameService.updateFieldGame(request);
        return ResponseEntity.ok(new MessageResponse("Zaktualizowano grę terenową!"));
    }

    @DeleteMapping("/deleteFieldGame/{id}")
    public ResponseEntity<MessageResponse> deleteFieldGame(@PathVariable Long id) {
        fieldGameService.deleteFieldGame(id);
        return ResponseEntity.ok(new MessageResponse("Usunięto grę terenową!"));
    }
}
