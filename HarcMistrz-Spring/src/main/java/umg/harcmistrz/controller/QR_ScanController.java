package umg.harcmistrz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import umg.harcmistrz.dto.FieldGameScoutResultDTO;
import umg.harcmistrz.dto.QR_ScanDTO;
import umg.harcmistrz.dto.TeamMemberDTO;
import umg.harcmistrz.service.QR_ScanService;

@RestController
@RequestMapping("/api/v1/qr_scan")
public class QR_ScanController {

    @Autowired
    private QR_ScanService qr_scanService;

    @GetMapping("/checkWhoScannedQRCode/{qrCodeId}")
    public ResponseEntity<QR_ScanDTO> checkWhoScannedQRCode(@PathVariable Long qrCodeId) {
        return ResponseEntity.ok(qr_scanService.checkWhoScannedQRCode(qrCodeId));
    }

    @GetMapping("/getPointsForScout/{fieldGameId}/{scoutId}")
    public ResponseEntity<Integer> getPointsForScout(@PathVariable Long scoutId, @PathVariable Long fieldGameId) {
        return ResponseEntity.ok(qr_scanService.getPointsForScoutInFieldGame(scoutId, fieldGameId));
    }
}
