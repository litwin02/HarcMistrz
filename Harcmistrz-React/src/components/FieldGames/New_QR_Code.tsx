import Header from "../Partials/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { useState } from "react";

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

    return (
        <>
            <Header />
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10 flex flex-col justify-center items-center">
                    <h1 className="text-3xl text-white">Nowy kod QR</h1>
                    <div className="w-1/2 bg-white p-5 rounded-lg mt-5">
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Opis kodu QR</label>
                                <textarea className="mt-1 p-2 rounded-md w-full border" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}required></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Punkty, które można uzyskać za zeskanowanie kodu</label>
                                <input type="number" className="mt-1 p-2 rounded-md w-full border" 
                                value={points}
                                onChange={(e) => setPoints(e.target.valueAsNumber)}/>
                            </div>
                            <button className="bg-p_green text-white p-2 rounded-md w-full" onClick={generateQRCode}>Dodaj kod QR</button>
                        </form>
                    </div>
                    {qrCodeUrl &&
                        <div className="w-1/2 bg-white p-5 rounded-lg mt-5">
                            <h2 className="text-2xl text-center">Wygenerowany kod QR</h2>
                            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
                            <a href={qrCodeUrl} download="QRCode.png">
                                <button className="bg-p_green text-white p-2 rounded-md w-full mt-2">Pobierz kod QR</button>
                            </a>
                        </div>
                    }
                    <button className="w-1/4 mt-5 bg-s_brown py-1 rounded text-white" onClick={() => navigate(`/event/${eventId}`)}>Wróć do panelu wydarzenia</button>
                </div>
            </main>
        </>
    );
    
};

export default New_QR_Code;