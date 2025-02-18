package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.*;
import umg.harcmistrz.dto.FieldGameResultDTO;
import umg.harcmistrz.dto.FieldGameScoutResultDTO;
import umg.harcmistrz.dto.QR_ScanDTO;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.repository.QR_ScanRepository;
import umg.harcmistrz.service.QR_ScanService;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QRScanServiceUnitTest {
    @Mock
    private QR_ScanRepository qr_scanRepository;

    @Mock
    private QR_CodeRepository qr_codeRepository;

    @Spy
    @InjectMocks
    private QR_ScanService qr_scanService;

    @Test
    void checkWhoScannedQRCode_ReturnsTeamMember_WhenQRCodeScanned() {
        Long qrCodeId = 1L;
        QR_Scan qrScan = new QR_Scan();
        ScoutInTeam scoutInTeam = new ScoutInTeam();
        scoutInTeam.setScout(new User(1L, "", "", "", "", "", Role.SCOUT));
        // Set necessary fields for scoutInTeam
        qrScan.setScout(scoutInTeam.getScout());
        qrScan.setQrCode(new QR_Code(qrCodeId, null, UUID.randomUUID(), 10, true, "", qrScan));
        qrScan.setScanTime(OffsetDateTime.now());

        when(qr_scanRepository.findByQrCodeId(qrCodeId)).thenReturn(qrScan);

        QR_ScanDTO result = qr_scanService.checkWhoScannedQRCode(qrCodeId);

        assertNotNull(result);
        assertEquals(scoutInTeam.getScout().getId(), result.getScoutId());
    }

    @Test
    void checkWhoScannedQRCode_ReturnsNull_WhenQRCodeNotScanned() {
        Long qrCodeId = 1L;

        when(qr_scanRepository.findByQrCodeId(qrCodeId)).thenReturn(null);

        QR_ScanDTO result = qr_scanService.checkWhoScannedQRCode(qrCodeId);

        assertNull(result);
    }

    @Test
    void getPointsForScout_ReturnsTotalPoints_WhenScansExist() {
        Long scoutId = 1L;
        Long fieldGameId = 1L;
        FieldGame fieldGame = new FieldGame(fieldGameId, "", "", FieldGameStatus.NOT_STARTED, null, null);

        QR_Scan qrScan1 = new QR_Scan();
        QR_Code qrCode1 = new QR_Code();
        qrCode1.setPoints(10);
        qrCode1.setFieldGame(fieldGame);
        qrScan1.setQrCode(qrCode1);

        QR_Scan qrScan2 = new QR_Scan();
        QR_Code qrCode2 = new QR_Code();
        qrCode2.setPoints(20);
        qrCode2.setFieldGame(fieldGame);
        qrScan2.setQrCode(qrCode2);

        when(qr_scanRepository.findAllByScoutId(scoutId)).thenReturn(List.of(qrScan1, qrScan2));

        Integer points = qr_scanService.getPointsForScoutInFieldGame(scoutId, fieldGameId);

        assertEquals(30, points);
    }

    @Test
    void getResultsForFieldGame_ReturnsResults_WhenFieldGameExists() {
        Long fieldGameId = 1L;
        QR_Code qrCode = new QR_Code();
        qrCode.setFieldGame(new FieldGame(fieldGameId, "", "", FieldGameStatus.NOT_STARTED, null, null));
        qrCode.setScanned(true);
        User scout = new User(1L, "", "", "", "", "", Role.SCOUT);
        QR_Scan qrScan = new QR_Scan(1L, scout, qrCode, null, 0);
        qrScan.setQrCode(qrCode);

        when(qr_codeRepository.findByFieldGameId(fieldGameId)).thenReturn(List.of(qrCode));
        when(qr_scanRepository.findByQrCodeId(qrCode.getId())).thenReturn(qrScan);

        List<FieldGameResultDTO> results = qr_scanService.getResultsForFieldGame(fieldGameId);

        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    void getResultFromFieldGameForScout_ReturnsCorrectResult_WhenScoutDidNotWin() {
        Long fieldGameId = 1L;
        Long scoutId = 1L;
        Long otherScoutId = 2L;

        QR_Scan qrScan = new QR_Scan();
        QR_Code qrCode = new QR_Code();
        qrCode.setFieldGame(new FieldGame(fieldGameId, "", "", FieldGameStatus.NOT_STARTED, null, null));
        qrCode.setPoints(10);
        qrCode.setScanned(true);
        qrScan.setQrCode(qrCode);
        qrScan.setScout(new User(scoutId, "Jan", "Kowalski", "", "", "", Role.SCOUT));

        QR_Scan otherQrScan = new QR_Scan();
        QR_Code otherQrCode = new QR_Code();
        otherQrCode.setFieldGame(new FieldGame(fieldGameId, "", "", FieldGameStatus.NOT_STARTED, null, null));
        otherQrCode.setPoints(20);
        otherQrCode.setScanned(true);
        otherQrScan.setQrCode(otherQrCode);
        otherQrScan.setScout(new User(otherScoutId, "Adam", "Nowak", "", "", "", Role.SCOUT));


        when(qr_scanRepository.findAllByScoutId(scoutId)).thenReturn(List.of(qrScan));

        doReturn(new ArrayList<>(List.of(
                FieldGameResultDTO.builder()
                        .fieldGameId(fieldGameId)
                        .scoutId(scoutId)
                        .points(10)
                        .build(),
                FieldGameResultDTO.builder()
                        .fieldGameId(fieldGameId)
                        .scoutId(otherScoutId)
                        .points(20)
                        .build()
        ))).when(qr_scanService).getResultsForFieldGame(fieldGameId);

        FieldGameScoutResultDTO result = qr_scanService.getResultFromFieldGameForScout(fieldGameId, scoutId);

        assertNotNull(result);
        assertEquals(scoutId, result.getScoutId());
        assertEquals(10, result.getPoints());
        assertEquals(1, result.getCodeScannedCount());
        assertFalse(result.isHasScoutWon());
        assertEquals(2, result.getScoreboardPosition());
    }
}
