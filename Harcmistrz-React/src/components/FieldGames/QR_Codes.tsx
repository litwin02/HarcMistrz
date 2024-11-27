import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import Header from "../Partials/Header";
import { FieldGameDTO } from "../Models/FieldGameDTO";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { QR_CodeDTO } from "../Models/QR_CodeDTO";


const QR_Codes = () => {
    const navigate = useNavigate();
    const API_BASE_URL = useApi();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();

    useEffect(() => {
        if(localStorage.getItem('role') !== 'TEAM_LEADER'){
            navigate('/dashboard');
        }
        getFieldGameById(fieldGameId? fieldGameId : "");
    }, []);

    const [fieldGame, setFieldGame] = useState<FieldGameDTO>();
    const getFieldGameById = async (id: string) => {
        try{
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
    

    // const generateQRCode = async () => {
    //     const response = await fetch(`${API_BASE_URL}/qr_codes/createNewQRCode`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`
    //         },
    //         body: JSON.stringify({
    //             fieldGameId: fieldGameId,
    //             points: 50,
    //             description: "test"
    //         })
    //     });
    //     if (!response.ok) {
    //         throw new Error("Nie udało się wygenerować kodu QR");
    //     }
    //     const blob = await response.blob();
    //     setQrCodeUrl(URL.createObjectURL(blob));
    // };

    
    const getQRCodesInfoByFieldGameId = async (id: string): Promise<any> => {
        try{
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
        try{
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
        if(confirmDelete){
            try{
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
        <>
            <Header />
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10 flex flex-col justify-center items-center">
                    <h1 className="text-3xl text-center text-white">Kody QR Gry Terenowej: {fieldGame?.name}</h1>
                    <div className="w-1/2 bg-white p-5 rounded-lg mt-10">
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {qrCodesIsLoading && <p>Ładowanie...</p>}
                                {qrCodesError && <p>Wystąpił błąd: {qrCodesError.message}</p>}
                                {qrCodes && qrCodes.map((qrCode: any, index: any) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                        <p>Opis: {qrCode.description}</p>
                                        <p>Punkty: {qrCode.points}</p>
                                        <p>Zeskanowany: {qrCode.scanned ? "Tak" : "Nie"}</p>
                                        {qrCodeImagesIsLoading && <p>Ładowanie obrazka...</p>}
                                        {qrCodeImagesError && <p>Wystąpił błąd: {qrCodeImagesError.message}</p>}
                                        {qrCodeImages && qrCodeImages[index] && (
                                            <img src={qrCodeImages[index]} alt="Kod QR" className="mt-2" />
                                        )}
                                        {qrCodeImages && qrCodeImages[index] && (
                                        <a href={qrCodeImages[index]}
                                            download={`QRCode_${qrCode.qrCode}.png`}>
                                            <button className="bg-p_green text-white py-1 px-2 rounded-lg mt-2 hover:text-s_brown">Pobierz kod QR</button>
                                        </a>
                                        )}
                                        <button className="bg-a_yellow text-white py-1 px-2 rounded-lg mt-2">Zmodyfikuj informacje o kodzie</button>
                                        <button className="bg-red-500 text-white py-1 px-2 rounded-lg mt-2" onClick={() => handleQRCodeDelete(qrCode.qrCode)}>Usuń kod</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="w-1/4 mt-5 bg-p_green py-1 rounded text-white hover:text-s_brown" onClick={() => navigate(`/new-qr-code/${fieldGameId}`)}>Dodaj kod QR</button>
                    <button className="w-1/4 mt-5 bg-s_brown py-1 rounded text-white" onClick={() => navigate(`/event/$`)}>Wróć do panelu wydarzenia</button>
                </div>
            </main>
        </>
    );
};

// TODO: Dodać przycisk wracania do panelu wydarzenia, zrobić stronę dodawania kodu QR, zrobić stronę edycji kodu QR, refactoring
// ManageEvent.tsx - nie sprawdzać czy jest tablica, tylko czy jest obiekt; Zabezpieczyć wszystkie strony rolami użytkowników
// być może będzie trzeba stworzyć middleware na wzór protected route; Zabezpieczyć endpointy w backendzie;
export default QR_Codes;