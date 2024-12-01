package umg.harcmistrz.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.FieldGame;
import umg.harcmistrz.dto.FieldGameDTO;
import umg.harcmistrz.repository.FieldGameRepository;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.requests.EditFieldGameRequest;
import umg.harcmistrz.requests.NewFieldGameRequest;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FieldGameService {

    @Autowired
    private final EventService eventService;

    @Autowired
    private final FieldGameRepository fieldGameRepository;

    @Autowired
    private final QR_CodeRepository qr_codeRepository;

    public void createNewFieldGame(NewFieldGameRequest newFieldGameRequest) {
        FieldGame fieldGame = new FieldGame();
        fieldGame.setName(newFieldGameRequest.getName());
        fieldGame.setDescription(newFieldGameRequest.getDescription());
        fieldGame.setIsActivated(false);
        fieldGame.setEvent(eventService.getEventById(newFieldGameRequest.getEventId()));
        fieldGameRepository.save(fieldGame);
    }

    public FieldGame getFieldGameById(Long id) {
        return fieldGameRepository.findById(id).orElse(null);
    }

    public FieldGame getFieldGameByEventId(Long eventId) {
        return fieldGameRepository.findByEventId(eventId);
    }

    public List<FieldGame> getAllFieldGamesByEventId(Long eventId) {
        return fieldGameRepository.findAllByEventId(eventId);
    }

    @Transactional
    public void deleteFieldGame(Long id) {
        qr_codeRepository.deleteAllByFieldGameId(id);
        fieldGameRepository.deleteById(id);
    }

    public void updateFieldGame(EditFieldGameRequest request) {
        FieldGame fieldGame = fieldGameRepository.findById(request.getId()).orElse(null);
        if (fieldGame != null) {
            fieldGame.setName(request.getName());
            fieldGame.setDescription(request.getDescription());
            fieldGameRepository.save(fieldGame);
        }
    }
}
