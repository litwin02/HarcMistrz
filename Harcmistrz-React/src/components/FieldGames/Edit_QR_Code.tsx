import Header from "../Partials/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { useState } from "react";
import { useQuery } from "react-query";
import { QR_CodeDTO } from "../Models/QR_CodeDTO";

const Edit_QR_Code = () => {
    const navigate = useNavigate();
    const API_BASE_URL = useApi();
    const { qrCodeId } = useParams<{ qrCodeId: string }>();
    const { eventId } = useParams<{ eventId: string }>();
    const [message, setMessage] = useState<string | null>(null);

    const getQRCodeInfoById = async (id: string): Promise<any> => {
        try{
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
        <>
            <Header />
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10 flex flex-col justify-center items-center">
                    <h1 className="text-3xl text-white">Edytuj kod QR</h1>
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
                            <button className="bg-p_green text-white p-2 rounded-md w-full" onClick={updateQRCode}>Edytuj kod QR</button>
                        </form>
                        {message && <p className="mt-2 text-2xl text-center">{message}</p>}
                    </div>
                    
                    <button className="w-1/4 mt-5 bg-s_brown py-1 rounded text-white" onClick={() => navigate(`/event/${eventId}`)}>Wróć do panelu wydarzenia</button>
                </div>
            </main>
        </>
    );
    
};

export default Edit_QR_Code;