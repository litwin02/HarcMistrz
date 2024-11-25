package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import umg.harcmistrz.requests.NewQR_CodeRequest;
import umg.harcmistrz.service.QR_CodeService;

@RestController
@RequestMapping("/api/v1/qr_codes")
public class QR_CodeController {

    @Autowired
    private QR_CodeService qr_codeService;

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
