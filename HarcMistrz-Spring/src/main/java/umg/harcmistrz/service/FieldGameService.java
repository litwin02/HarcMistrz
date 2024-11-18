package umg.harcmistrz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.FieldGameDTO;
import umg.harcmistrz.repository.FieldGameRepository;

@RequiredArgsConstructor
@Service
public class FieldGameService {

    @Autowired
    private final EventService eventService;

    @Autowired
    private final FieldGameRepository fieldGameRepository;

    public void createNewFieldGame(FieldGameDTO newFieldGameRequest) {
        FieldGame fieldGame = new FieldGame();
        fieldGame.setName(newFieldGameRequest.getName());
        fieldGame.setDescription(newFieldGameRequest.getDescription());
        fieldGame.setLocation(newFieldGameRequest.getLocation());
        fieldGame.setEvent(eventService.getEventById(newFieldGameRequest.getEventId()));
        fieldGameRepository.save(fieldGame);
    }

    public FieldGame getFieldGameById(Long id) {
        return fieldGameRepository.findById(id).orElse(null);
    }

    public void deleteFieldGame(Long id) {
        fieldGameRepository.deleteById(id);
    }

    public void updateFieldGame(Long id, FieldGameDTO newFieldGameRequest) {
        FieldGame fieldGame = fieldGameRepository.findById(id).orElse(null);
        if (fieldGame != null) {
            fieldGame.setName(newFieldGameRequest.getName());
            fieldGame.setDescription(newFieldGameRequest.getDescription());
            fieldGame.setLocation(newFieldGameRequest.getLocation());
            fieldGameRepository.save(fieldGame);
        }
    }
}
