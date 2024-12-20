import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { FieldGameDTO } from "../Models/FieldGameDTO";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { QR_CodeDTO } from "../Models/QR_CodeDTO";
import MainPage from "../Pages/MainPage";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { BoldText } from "../shared/bold-text";
import { WhiteBox } from "../shared/white-box";
import { MainBox } from "../shared/main-box";
import { SharedP } from "../shared/shared-p";
import { GreenButton } from "../shared/shared-green-button";
import { YellowButton } from "../shared/yellow_button";
import { ButtonContainer } from "../shared/button-container";
import { RedButton } from "../shared/red-button";
import { ReturnButton } from "../shared/shared-return-button";
import { HorizontalButtonContainer } from "../shared/horizontal-button-container";


const QR_Codes = () => {
    const navigate = useNavigate();
    const API_BASE_URL = useApi();
    const { eventId } = useParams<{ eventId: string }>();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();

    useEffect(() => {
        getFieldGameById(fieldGameId ? fieldGameId : "");
    }, []);

    const [fieldGame, setFieldGame] = useState<FieldGameDTO>();
    const getFieldGameById = async (id: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldGames/getFieldGameById/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać gry terenowej");
            }
            const responseJson = await response.json();
            setFieldGame(responseJson);
        } catch (error) {
            console.error(error);
        }
    };

    const getQRCodesInfoByFieldGameId = async (id: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/qr_codes/getQRCodesInfoByFieldGameId/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać kodów QR");
            }
            const responseJson = await response.json();
            return responseJson;
        }
        catch (error) {
            console.error(error);
        }
    };

    const getQRCodeImageByQRCodeId = async (id: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/qr_codes/getQRCodeImageByQRCodeId/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać obrazka kodu QR");
            }
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
        catch (error) {
            console.error(error);
        }
    };


    const { data: qrCodes, error: qrCodesError, isLoading: qrCodesIsLoading } = useQuery<QR_CodeDTO[], Error>(
        ['qrCodes', fieldGameId],
        () => getQRCodesInfoByFieldGameId(fieldGameId!),
        { enabled: !!fieldGameId }
    );

    const { data: qrCodeImages, error: qrCodeImagesError, isLoading: qrCodeImagesIsLoading } = useQuery<string[], Error>(
        ['qrCodeImages', qrCodes],
        () => Promise.all(qrCodes!.map(qrCode => getQRCodeImageByQRCodeId(qrCode.qrCode.toString()))),
        { enabled: !!qrCodes }
    );

    const handleQRCodeDelete = async (qrCode: string) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć ten kod QR?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${API_BASE_URL}/qr_codes/deleteQRCode/${qrCode}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Nie udało się usunąć kodu QR");
                }
                alert("Kod QR został usunięty.");
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        };
    };

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Kody QR gry: <BoldText>{fieldGame?.name}</BoldText></MainPageHeader>
                <WhiteBox>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qrCodesIsLoading && <p>Ładowanie...</p>}
                    {qrCodesError && <p>Wystąpił błąd: {qrCodesError.message}</p>}
                    {qrCodes && qrCodes.map((qrCode: any, index: any) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                            <SharedP><BoldText>Opis:</BoldText> {qrCode.description}</SharedP>
                            <SharedP><BoldText>Punkty:</BoldText> {qrCode.points}</SharedP>
                            <SharedP><BoldText>Zeskanowany:</BoldText> {qrCode.scanned ? "Tak" : "Nie"}</SharedP>

                            {qrCodeImagesIsLoading && <SharedP>Ładowanie obrazka...</SharedP>}
                            {qrCodeImagesError && <SharedP>Wystąpił błąd: {qrCodeImagesError.message}</SharedP>}
                            {qrCodeImages && qrCodeImages[index] && (
                                <img src={qrCodeImages[index]} alt="Kod QR" className="my-2" />
                            )}

                            {qrCodeImages && qrCodeImages[index] && (
                                <HorizontalButtonContainer>
                                    <GreenButton>
                                    <a href={qrCodeImages[index]}
                                        download={`QRCode_${qrCode.qrCode}.png`}>
                                        Pobierz kod QR
                                        </a>
                                    </GreenButton>
                                    <YellowButton onClick={() => navigate(`/edit-qr-code/${eventId}/${qrCode.id}`)}>Zmodyfikuj informacje o kodzie</YellowButton>
                                    <RedButton onClick={() => handleQRCodeDelete(qrCode.qrCode)}>Usuń kod</RedButton>
                                </HorizontalButtonContainer>
                            )}
                        </div>
                    ))}
                    {(!qrCodes || qrCodes.length === 0) && <SharedP>Brak kodów QR dla tej gry terenowej.</SharedP>}
                    </div>
                </WhiteBox>
                <WhiteBox>
                    <ButtonContainer>
                        <GreenButton onClick={() => navigate(`/new-qr-code/${eventId}/${fieldGameId}`)}>Dodaj kod QR</GreenButton>
                    </ButtonContainer>
                </WhiteBox>
                <ReturnButton to={`/event/${eventId}`}>Wróć do gier terenowych</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default QR_Codes;