package umg.harcmistrz;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import umg.harcmistrz.Models.*;
import umg.harcmistrz.dto.MessageResponse;
import umg.harcmistrz.dto.QR_CodeDTO;
import umg.harcmistrz.repository.*;
import umg.harcmistrz.requests.NewQR_CodeRequest;
import umg.harcmistrz.requests.ScanQR_CodeRequest;
import umg.harcmistrz.requests.UpdateQR_CodeRequest;
import umg.harcmistrz.service.QR_CodeService;
import umg.harcmistrz.service.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QRCodeServiceUnitTest {
    @Mock
    private QR_CodeRepository qr_codeRepository;

    @Mock
    private FieldGameRepository fieldGameRepository;

    @Mock
    private QR_ScanRepository qr_scanRepository;

    @Mock
    private ScoutInTeamRepository scoutInTeamRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private QR_CodeService qr_codeService;

    @Test
    void getQRCodesByFieldGameId_ReturnsQRCodes_WhenFieldGameExists() {
        Long fieldGameId = 1L;
        QR_Code qrCode = new QR_Code();
        qrCode.setId(1L);
        qrCode.setFieldGame(new FieldGame(fieldGameId, "", "", FieldGameStatus.NOT_STARTED, null, null));
        qrCode.setQrCode(UUID.randomUUID());
        qrCode.setPoints(10);
        qrCode.setScanned(false);
        qrCode.setDescription("Test QR Code");

        when(qr_codeRepository.findByFieldGameId(fieldGameId)).thenReturn(List.of(qrCode));

        List<QR_CodeDTO> qrCodes = qr_codeService.getQRCodesByFieldGameId(fieldGameId);

        assertNotNull(qrCodes);
        assertEquals(1, qrCodes.size());
        assertEquals(qrCode.getId(), qrCodes.get(0).getId());
    }

    @Test
    void getQRCodeById_ReturnsQRCode_WhenQRCodeExists() {
        Long qrCodeId = 1L;
        QR_Code qrCode = new QR_Code();
        qrCode.setId(qrCodeId);
        qrCode.setFieldGame(new FieldGame(1L, "", "", FieldGameStatus.NOT_STARTED, null, null));
        qrCode.setQrCode(UUID.randomUUID());
        qrCode.setPoints(10);
        qrCode.setScanned(false);
        qrCode.setDescription("Test QR Code");

        when(qr_codeRepository.findById(qrCodeId)).thenReturn(Optional.of(qrCode));

        QR_CodeDTO qrCodeDTO = qr_codeService.getQRCodeById(qrCodeId);

        assertNotNull(qrCodeDTO);
        assertEquals(qrCode.getId(), qrCodeDTO.getId());
    }

    @Test
    void getQRCodeById_ThrowsException_WhenQRCodeNotFound() {
        Long qrCodeId = 1L;

        when(qr_codeRepository.findById(qrCodeId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> qr_codeService.getQRCodeById(qrCodeId));
    }

    @Test
    void deleteQRCode_DeletesQRCode_WhenQRCodeExists() {
        UUID qrCodeUUID = UUID.randomUUID();
        QR_Code qrCode = new QR_Code();
        qrCode.setQrCode(qrCodeUUID);

        when(qr_codeRepository.findByQrCode(qrCodeUUID)).thenReturn(Optional.of(qrCode));

        qr_codeService.deleteQRCode(qrCodeUUID);

        verify(qr_codeRepository, times(1)).delete(qrCode);
    }

    @Test
    void deleteQRCode_ThrowsException_WhenQRCodeNotFound() {
        UUID qrCodeUUID = UUID.randomUUID();

        when(qr_codeRepository.findByQrCode(qrCodeUUID)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> qr_codeService.deleteQRCode(qrCodeUUID));
    }

    @Test
    void modifyQRCode_UpdatesQRCode_WhenQRCodeExists() {
        Long qrCodeId = 1L;
        UpdateQR_CodeRequest request = new UpdateQR_CodeRequest(qrCodeId, 20, "Updated description");
        QR_Code qrCode = new QR_Code();
        qrCode.setId(qrCodeId);
        qrCode.setPoints(10);
        qrCode.setDescription("Old description");

        when(qr_codeRepository.findById(qrCodeId)).thenReturn(Optional.of(qrCode));

        qr_codeService.modifyQRCode(request);

        assertEquals(request.getPoints(), qrCode.getPoints());
        assertEquals(request.getDescription(), qrCode.getDescription());
        verify(qr_codeRepository, times(1)).save(qrCode);
    }

    @Test
    void modifyQRCode_ThrowsException_WhenQRCodeNotFound() {
        Long qrCodeId = 1L;
        UpdateQR_CodeRequest request = new UpdateQR_CodeRequest(qrCodeId, 20, "Updated description");

        when(qr_codeRepository.findById(qrCodeId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> qr_codeService.modifyQRCode(request));
    }

    @Test
    void scanQRCode_ReturnsSuccessMessage_WhenQRCodeScannedSuccessfully() {
        UUID qrCodeUUID = UUID.randomUUID();
        Long scoutId = 1L;
        ScanQR_CodeRequest request = new ScanQR_CodeRequest(qrCodeUUID, 1L, scoutId);
        QR_Code qrCode = new QR_Code();
        qrCode.setQrCode(qrCodeUUID);
        qrCode.setScanned(false);
        qrCode.setFieldGame(new FieldGame(1L, "", "", FieldGameStatus.IN_PROGRESS, null, null));
        User scout = new User(scoutId, "", "", "", "", "", Role.SCOUT);

        when(qr_codeRepository.findByQrCode(qrCodeUUID)).thenReturn(Optional.of(qrCode));
        when(userService.getUserById(scoutId)).thenReturn(scout);

        MessageResponse response = qr_codeService.scanQRCode(request);

        assertTrue(response.isSuccess());
        assertEquals("Zeskanowano kod QR!", response.getMessage());
        verify(qr_codeRepository, times(1)).save(qrCode);
        verify(qr_scanRepository, times(1)).save(any(QR_Scan.class));
    }

    @Test
    void scanQRCode_ReturnsErrorMessage_WhenQRCodeAlreadyScanned() {
        UUID qrCodeUUID = UUID.randomUUID();
        Long scoutId = 1L;
        ScanQR_CodeRequest request = new ScanQR_CodeRequest(qrCodeUUID, 1L, scoutId);
        QR_Code qrCode = new QR_Code();
        qrCode.setQrCode(qrCodeUUID);
        qrCode.setScanned(true);

        when(qr_codeRepository.findByQrCode(qrCodeUUID)).thenReturn(Optional.of(qrCode));

        MessageResponse response = qr_codeService.scanQRCode(request);

        assertFalse(response.isSuccess());
        assertEquals("Kod QR został już zeskanowany!", response.getMessage());
        verify(qr_codeRepository, never()).save(qrCode);
        verify(qr_scanRepository, never()).save(any(QR_Scan.class));
    }

    @Test
    void scanQRCode_ReturnsErrorMessage_WhenQRCodeNotFound() {
        UUID qrCodeUUID = UUID.randomUUID();
        Long scoutId = 1L;
        ScanQR_CodeRequest request = new ScanQR_CodeRequest(qrCodeUUID, 1L, scoutId);

        when(qr_codeRepository.findByQrCode(qrCodeUUID)).thenReturn(Optional.empty());

        MessageResponse response = qr_codeService.scanQRCode(request);

        assertFalse(response.isSuccess());
        assertEquals("Kod QR nie istnieje!", response.getMessage());
        verify(qr_codeRepository, never()).save(any(QR_Code.class));
        verify(qr_scanRepository, never()).save(any(QR_Scan.class));
    }
}
