import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { useState } from "react";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";
import { SharedH2 } from "../shared/shared-h2";

const New_QR_Code = () => {
    const navigate = useNavigate();
    const API_BASE_URL = useApi();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();
    const { eventId } = useParams<{ eventId: string }>();
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const generateQRCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/qr_codes/createNewQRCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fieldGameId: fieldGameId,
                points: points,
                description: description,
            })
        });
        if (!response.ok) {
            throw new Error("Nie udało się wygenerować kodu QR");
        }
        const blob = await response.blob();
        setQrCodeUrl(URL.createObjectURL(blob));
    };

    const [description, setDescription] = useState<string>("");
    const [points, setPoints] = useState<number>(0);
    const returnString = `/qr-codes/${eventId}/${fieldGameId}`;

    return (
        <MainBox>
                <WhiteBoxColumn>
                    <MainPageHeader>Nowy kod QR</MainPageHeader>
                    <WhiteBox>
                    <form onSubmit={generateQRCode}>
                            <FormDiv>
                                <FormLabel>Opis kodu QR</FormLabel>
                                <textarea className="mt-1 p-2 rounded-md w-full border" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}required></textarea>
                            </FormDiv>
                            <FormDiv>
                                <FormLabel>Punkty, jakie można uzyskać za zeskanowanie kodu</FormLabel>
                                <input type="number" className="mt-1 p-2 rounded-md w-full border" 
                                value={points}
                                required
                                min={1}
                                onChange={(e) => setPoints(e.target.valueAsNumber)}/>
                            </FormDiv>
                            <GreenButton type="submit">Generuj kod QR</GreenButton>
                        </form>
                    </WhiteBox>
                    {qrCodeUrl &&
                    <WhiteBox>
                        <SharedH2>Wygenerowany kod QR</SharedH2>
                        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-1/4"/>}
                            <a href={qrCodeUrl} download="QRCode.png">
                                <GreenButton>Pobierz kod QR</GreenButton>
                            </a>
                        </WhiteBox>}
                    <ReturnButton to={returnString}>Wróć do kodów QR</ReturnButton>
                </WhiteBoxColumn>
        </MainBox>
    );
    
};

export default New_QR_Code;