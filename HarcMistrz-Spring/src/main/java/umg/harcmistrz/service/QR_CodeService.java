package umg.harcmistrz.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.QR_Code;
import umg.harcmistrz.repository.FieldGameRepository;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.requests.NewQR_CodeRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class QR_CodeService {

    @Autowired
    private final QR_CodeRepository qr_codeRepository;

    @Autowired
    private final FieldGameRepository fieldGameRepository;

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
