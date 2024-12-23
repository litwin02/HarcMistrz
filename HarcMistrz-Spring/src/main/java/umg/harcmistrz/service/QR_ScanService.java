package umg.harcmistrz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import umg.harcmistrz.Models.QR_Code;
import umg.harcmistrz.Models.QR_Scan;
import umg.harcmistrz.Models.ScoutInTeam;
import umg.harcmistrz.dto.FieldGameResultDTO;
import umg.harcmistrz.dto.FieldGameScoutResultDTO;
import umg.harcmistrz.dto.QR_ScanDTO;
import umg.harcmistrz.dto.TeamMemberDTO;
import umg.harcmistrz.repository.QR_CodeRepository;
import umg.harcmistrz.repository.QR_ScanRepository;

import java.util.*;

@Service
public class QR_ScanService {

    @Autowired
    private QR_ScanRepository qr_scanRepository;

    @Autowired
    private QR_CodeRepository qr_codeRepository;

    public QR_ScanDTO checkWhoScannedQRCode(Long qrCodeId) {
        QR_Scan qr_scan = qr_scanRepository.findByQrCodeId(qrCodeId);
        if(qr_scan != null) {
            ScoutInTeam scout = qr_scan.getScout();
            assert qr_scan.getQrCode() != null;
            return QR_ScanDTO.builder()
                    .id(qr_scan.getId())
                    .scoutId(scout.getScout().getId())
                    .firstName(scout.getScout().getFirstName())
                    .lastName(scout.getScout().getLastName())
                    .email(scout.getScout().getEmail())
                    .qrCodeId(qr_scan.getQrCode().getId())
                    .scanTime(qr_scan.getScanTime().toString())
                    .points(qr_scan.getQrCode().getPoints())
                    .build();
        }
        return null;
    }

    public Integer getPointsForScoutInFieldGame(Long scoutId, Long fieldGameId) {
        return qr_scanRepository.findAllByScoutId(scoutId).stream()
                .map(QR_Scan::getQrCode).filter(Objects::nonNull)
                .filter(qr_code -> qr_code.getFieldGame().getId().equals(fieldGameId))
                .mapToInt(QR_Code::getPoints)
                .sum();
    }

    public List<FieldGameResultDTO> getResultsForFieldGame(Long fieldGameId) {
        List<QR_Code> qr_codes = qr_codeRepository.findByFieldGameId(fieldGameId).stream().filter(QR_Code::isScanned).toList();
        List<QR_Scan> qr_scans = qr_codes.stream()
                .map(qr_code -> qr_scanRepository.findByQrCodeId(qr_code.getId()))
                .filter(Objects::nonNull)
                .toList();

        // key: scoutId, value: result
        Map<Long, FieldGameResultDTO> resultsMap = new HashMap<>();

        // how this works:
        // map ensures that we have only one result for each scout
        // we iterate over all qr_scans and for each qr_scan we get the scoutId
        // then we get the result from the map, if it doesn't exist we create a new one
        // then we add the points from the qr_scan to the result

        for (QR_Scan qr_scan : qr_scans) {
            Long scoutId = qr_scan.getScout().getScout().getId();
            FieldGameResultDTO result = resultsMap.getOrDefault(scoutId, FieldGameResultDTO.builder()
                    .scoutId(scoutId)
                    .firstName(qr_scan.getScout().getScout().getFirstName())
                    .lastName(qr_scan.getScout().getScout().getLastName())
                    .email(qr_scan.getScout().getScout().getEmail())
                    .points(0)
                    .build());

            assert qr_scan.getQrCode() != null;
            result.setPoints(result.getPoints() + qr_scan.getQrCode().getPoints());
            resultsMap.put(scoutId, result);
        }

        return new ArrayList<>(resultsMap.values());
    }

    public FieldGameScoutResultDTO getResultFromFieldGameForScout(Long fieldGameId, Long scoutId) {
        List<QR_Scan> qr_scans = qr_scanRepository.findAllByScoutId(scoutId);
        List<QR_Code> qr_codes = qr_scans.stream()
                .map(QR_Scan::getQrCode)
                .filter(Objects::nonNull)
                .filter(qr_code -> qr_code.getFieldGame().getId().equals(fieldGameId))
                .toList();

        int points = qr_codes.stream()
                .mapToInt(QR_Code::getPoints)
                .sum();

        int codeScannedCount = (int) qr_codes.stream()
                .filter(QR_Code::isScanned)
                .count();

        return FieldGameScoutResultDTO.builder()
                .fieldGameId(fieldGameId)
                .scoutId(scoutId)
                .points(points)
                .codeScannedCount(codeScannedCount)
                .build();
    }
}
