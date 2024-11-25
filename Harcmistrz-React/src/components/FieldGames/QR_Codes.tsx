import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";

const QR_Codes = () => {
    const { fieldGameId } = useParams<{ fieldGameId: string }>();
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const API_BASE_URL = useApi();

    const generateQRCode = async () => {
        const response = await fetch(`${API_BASE_URL}/qr_codes/createNewQRCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fieldGameId: fieldGameId,
                points: 50,
                description: "test"
            })
        });
        if (!response.ok) {
            throw new Error("Nie udało się wygenerować kodu QR");
        }
        const blob = await response.blob();
        setQrCodeUrl(URL.createObjectURL(blob));
    };

    return (
        <div>
            <button onClick={generateQRCode}>Generate QR Code</button>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
        </div>
    );
};

export default QR_Codes;