import { useState } from "react";
import { BoldText } from "../shared/bold-text";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { GetPointsForScout, QR_CodeString, QRCodeScanRequest, ScanQRCode } from "../API/field-game";
import { MessageResponse } from "../Models/MessageResponse";
import { useApi } from "../../ApiContext";
import { useParams } from "react-router-dom";
import { Message } from "../shared/message";

const PlayFieldGame = () => {
    const API_BASE_URL = useApi();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();

    const [points, setPoints] = useState<number>(0);
    const [message, setMessage] = useState<MessageResponse>();

    // Inicjalizacja skanera w momencie, gdy element DOM istnieje
    useEffect(() => {
        getPoints();
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
        );

        async function success(result: string) {
            const data: QR_CodeString = JSON.parse(result);
            if (data && fieldGameId) {
                const scanRequest: QRCodeScanRequest = {
                    qrCode: data.qr_code_id,
                    scoutId: parseInt(localStorage.getItem("id")!),
                    fieldGameId: parseInt(fieldGameId),
                };
                const response = await ScanQRCode(API_BASE_URL, scanRequest);
                setMessage(response);

            }
        }

        async function getPoints() {
            if (fieldGameId) {
                const response = await GetPointsForScout(API_BASE_URL, parseInt(fieldGameId), parseInt(localStorage.getItem("id")!));
                setPoints(response);
            }
        }

        function error(error: any) {
            console.error("Błąd skanowania:", error);
        }

        scanner.render(success, error); // Inicjalizacja skanera

        return () => {
            scanner.clear().catch((error) => console.error("Błąd czyszczenia skanera:", error));
        };
    }, [API_BASE_URL, fieldGameId]);

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Gra terenowa</MainPageHeader>
                <WhiteBox>
                    <SharedH2>Skanuj kody QR aby uzyskać punkty!</SharedH2>
                    <SharedP>
                        Twój wynik: <BoldText>{points}</BoldText>
                    </SharedP>
                    {message && <Message>{message.message}</Message>}
                    <style>{`
                        #qr-reader {
                            width: 100% !important;
                            max-width: 500px;
                            margin: 0 auto;
                        }
                    `}</style>
                </WhiteBox>
                <div id="qr-reader" className="mt-4 bg-white lg:w-1/2 md:w-full sm:full"></div>
            </WhiteBoxColumn>

        </MainBox>
    );
};

export default PlayFieldGame;