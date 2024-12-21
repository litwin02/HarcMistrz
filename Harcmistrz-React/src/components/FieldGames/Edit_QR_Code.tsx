import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { useState } from "react";
import { useQuery } from "react-query";
import { QR_CodeDTO } from "../Models/QR_CodeDTO";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { ButtonContainer } from "../shared/button-container";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";

const Edit_QR_Code = () => {
    const API_BASE_URL = useApi();
    const { qrCodeId } = useParams<{ qrCodeId: string }>();
    const { eventId } = useParams<{ eventId: string }>();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();
    const [message, setMessage] = useState<string | null>(null);

    const getQRCodeInfoById = async (id: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/qr_codes/getQRCodeInfoById/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać kodu QR");
            }
            const responseJson = await response.json();
            setDescription(responseJson.description);
            setPoints(responseJson.points);
        } catch (error) {
            console.error(error);
        }
    }

    const { data: qrCode } = useQuery<QR_CodeDTO, Error>(
        ['qrCodes', qrCodeId],
        () => getQRCodeInfoById(qrCodeId!),
        { enabled: !!qrCodeId }
    );

    const updateQRCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/qr_codes/modifyQRCode`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: qrCodeId,
                    points: points,
                    description: description,
                })
            });
            if (!response.ok) {
                throw new Error("Nie udało się zaktualizować kodu QR");
            }
            const responseJson = await response.json();
            setMessage(responseJson.message);

        } catch (error) {
            console.error(error);
        }
    }

    const [description, setDescription] = useState<string>("");
    const [points, setPoints] = useState<number>(0);

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Edytuj informacje kodu QR</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={updateQRCode}>
                        <FormDiv>
                            <FormLabel>Opis kodu QR</FormLabel>
                            <textarea className="mt-1 p-2 rounded-md w-full border"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Punkty, które można uzyskać za zeskanowanie kodu</FormLabel>
                            <input type="number" className="mt-1 p-2 rounded-md w-full border"
                                value={points}
                                required
                                min={1}
                                onChange={(e) => setPoints(e.target.valueAsNumber)} />
                        </FormDiv>

                        <ButtonContainer>
                            <GreenButton type="submit">Edytuj kod QR</GreenButton>
                        </ButtonContainer>
                    </form>
                    {message && <p className="mt-2 text-2xl text-center">{message}</p>}
                </WhiteBox>
                <ReturnButton to={`/qr-codes/${eventId}/${fieldGameId}`}>Wróć do listy kodów QR</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );

};

export default Edit_QR_Code;