package umg.harcmistrz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import umg.harcmistrz.dto.FieldGameDTO;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.service.FieldGameService;

@RestController("api/v1/fieldGames")
@RequiredArgsConstructor
public class FieldGameController {

    @Autowired
    private FieldGameService fieldGameService;

    @PostMapping("/createNewFieldGame")
    public ResponseEntity<MessageResponse> createNewFieldGame(@RequestBody FieldGameDTO newFieldGameRequest) {
        fieldGameService.createNewFieldGame(newFieldGameRequest);
        return ResponseEntity.ok(new MessageResponse("Utworzono nowe pole gry!"));
    }
}
