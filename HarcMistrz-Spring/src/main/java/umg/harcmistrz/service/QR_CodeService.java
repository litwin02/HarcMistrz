package umg.harcmistrz.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.*;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.QR_CodeDTO;
import umg.harcmistrz.repository.*;
import umg.harcmistrz.requests.NewQR_CodeRequest;
import umg.harcmistrz.requests.ScanQR_CodeRequest;
import umg.harcmistrz.requests.UpdateQR_CodeRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class QR_CodeService {

    @Autowired
    private final QR_CodeRepository qr_codeRepository;

    @Autowired
    private final FieldGameRepository fieldGameRepository;

    @Autowired
    private final QR_ScanRepository qr_scanRepository;

    @Autowired
    private final ScoutInTeamRepository scoutInTeamRepository;

    @Autowired
    private final UserService userService;

    public List<QR_CodeDTO> getQRCodesByFieldGameId(Long id) {
        List<QR_Code> qr_codes = qr_codeRepository.findByFieldGameId(id);
        return qr_codes.stream()
                .map(qrCode -> QR_CodeDTO.builder()
                        .id(qrCode.getId())
                        .fieldGameId(qrCode.getFieldGame().getId())
                        .qrCode(qrCode.getQrCode())
                        .points(qrCode.getPoints())
                        .scanned(qrCode.isScanned())
                        .description(qrCode.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public QR_CodeDTO getQRCodeById(Long id) {
        Optional<QR_Code> qr_code = qr_codeRepository.findById(id);
        if (qr_code.isEmpty()) {
            throw new IllegalArgumentException("QR Code not found");
        }
        return QR_CodeDTO.builder()
                .id(qr_code.get().getId())
                .fieldGameId(qr_code.get().getFieldGame().getId())
                .qrCode(qr_code.get().getQrCode())
                .points(qr_code.get().getPoints())
                .scanned(qr_code.get().isScanned())
                .description(qr_code.get().getDescription())
                .build();
    }

    public void deleteQRCode(UUID qrCode) {
        Optional<QR_Code> qr_code = qr_codeRepository.findByQrCode(qrCode);
        if (qr_code.isEmpty()) {
            throw new IllegalArgumentException("QR Code not found");
        }
        qr_codeRepository.delete(qr_code.get());
    }

    public void modifyQRCode(UpdateQR_CodeRequest qrCodeRequest) {
        Optional<QR_Code> qr_code = qr_codeRepository.findById(qrCodeRequest.getId());
        if (qr_code.isEmpty()) {
            throw new IllegalArgumentException("QR Code not found");
        }
        qr_code.get().setPoints(qrCodeRequest.getPoints());
        qr_code.get().setDescription(qrCodeRequest.getDescription());
        qr_codeRepository.save(qr_code.get());
    }

    public byte[] getQRCodeImageByQRCodeId(UUID qrCode){
        try{
            Optional<QR_Code> qr_code = qr_codeRepository.findByQrCode(qrCode);
            if (qr_code.isEmpty()) {
                throw new IllegalArgumentException("QR Code not found");
            }
            String data = String.format("{\"qr_code_id\":\"%s\", \"field_game_id\":\"%d\", \"points\":%d}",
                    qr_code.get().getQrCode(),
                    qr_code.get().getFieldGame().getId(),
                    qr_code.get().getPoints());
            return generateQRCodeImage(data, 300, 300);
        } catch (Exception e) {
            throw new RuntimeException("Could not generate QR Code", e);
        }

    }

    public byte[] saveQRCode(NewQR_CodeRequest newQR_CodeRequest) throws IOException {
        QR_Code qr_code = new QR_Code();

        UUID qrCodeUUID;
        do {
            qrCodeUUID = generateUniqueQRCodeId();
        } while (qr_codeRepository.findByQrCode(qrCodeUUID).isPresent());
        String data = String.format("{\"qr_code_id\":\"%s\", \"field_game_id\":\"%d\", \"points\":%d}",
                qrCodeUUID, newQR_CodeRequest.getFieldGameId(), newQR_CodeRequest.getPoints());

        qr_code.setQrCode(qrCodeUUID);
        qr_code.setFieldGame(fieldGameRepository.findById(newQR_CodeRequest.getFieldGameId()).orElse(null));
        qr_code.setPoints(newQR_CodeRequest.getPoints());
        qr_code.setDescription(newQR_CodeRequest.getDescription());
        qr_code.setScanned(false);

        qr_codeRepository.save(qr_code);

        return generateQRCodeImage(data, 300, 300);
    }

    public MessageResponse scanQRCode(ScanQR_CodeRequest qrCode) {
        Optional<QR_Code> qr_code = qr_codeRepository.findByQrCode(qrCode.getQrCode());
        if (qr_code.isEmpty()) {
            return new MessageResponse("Kod QR nie istnieje!", false);
        }

        if (qr_code.get().isScanned()) {
            return new MessageResponse("Kod QR został już zeskanowany!", false);
        }

        FieldGame fieldGame = qr_code.get().getFieldGame();
        if (fieldGame == null) {
            return new MessageResponse("Nie znaleziono gry terenowej.", false);
        }

        if(!fieldGame.getStatus().equals(FieldGameStatus.IN_PROGRESS)) {
            return new MessageResponse("Gra terenowa nie jest aktywna lub została zakończona.", false);
        }

        qr_code.get().setScanned(true);
        qr_codeRepository.save(qr_code.get());


        User scout = userService.getUserById(qrCode.getScoutId());
        if (scout == null) {
            return new MessageResponse("Nie odnaleziono takiego harcerza.", false);
        }

        QR_Scan qr_scan = new QR_Scan();
        qr_scan.setQrCode(qr_code.get());
        qr_scan.setPoints(qr_code.get().getPoints());
        qr_scan.setScanTime(OffsetDateTime.now(ZoneId.of("Europe/Warsaw")));
        qr_scan.setScout(scout);
        qr_scanRepository.save(qr_scan);

        return new MessageResponse("Zeskanowano kod QR!", true);
    }

    // PRIVATE METHODS

    private byte[] generateQRCodeImage(String data, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            return pngOutputStream.toByteArray();
        }
        catch (Exception e) {
            throw new RuntimeException("Could not generate QR Code", e);
        }
    }

    private UUID generateUniqueQRCodeId() {
        return UUID.randomUUID();
    }


}
