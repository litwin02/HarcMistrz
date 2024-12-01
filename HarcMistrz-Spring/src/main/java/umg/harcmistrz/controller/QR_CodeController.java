package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.QR_CodeDTO;
import umg.harcmistrz.requests.NewQR_CodeRequest;
import umg.harcmistrz.requests.UpdateQR_CodeRequest;
import umg.harcmistrz.service.QR_CodeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/qr_codes")
public class QR_CodeController {

    @Autowired
    private QR_CodeService qr_codeService;

    @GetMapping("/getQRCodeInfoById/{id}")
    public ResponseEntity<QR_CodeDTO> getQRCodeInfoById(@PathVariable Long id) {
        try {
            QR_CodeDTO qrCode = qr_codeService.getQRCodeById(id);
            return ResponseEntity.ok(qrCode);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getQRCodesInfoByFieldGameId/{id}")
    public ResponseEntity<List<QR_CodeDTO>> getQRCodesInfoByFieldGameId(@PathVariable Long id) {
        try {
            List<QR_CodeDTO> qrCodes = qr_codeService.getQRCodesByFieldGameId(id);
            return ResponseEntity.ok(qrCodes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getQRCodeImageByQRCodeId/{qrCode}")
    public ResponseEntity<byte[]> getQRCodeImageByQRCodeId(@PathVariable UUID qrCode) {
        try {
            byte[] qrCodeImage = qr_codeService.getQRCodeImageByQRCodeId(qrCode);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE).body(qrCodeImage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/deleteQRCode/{qrCode}")
    public ResponseEntity<MessageResponse> deleteQRCode(@PathVariable UUID qrCode) {
        try {
            qr_codeService.deleteQRCode(qrCode);
            return ResponseEntity.ok(new MessageResponse("Usunięto kod QR!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // przetestować ten endpoint
    @PutMapping("/modifyQRCode")
    public ResponseEntity<MessageResponse> modifyQRCode(@RequestBody UpdateQR_CodeRequest qrCodeRequest) {
        try {
            qr_codeService.modifyQRCode(qrCodeRequest);
            return ResponseEntity.ok(new MessageResponse("Zmodyfikowano kod QR!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/createNewQRCode")
    public ResponseEntity<byte[]> createNewQRCode(@RequestBody NewQR_CodeRequest newQR_CodeRequest) {
        try {
            byte[] qrCode = qr_codeService.saveQRCode(newQR_CodeRequest);
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE).body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
