import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { MessageResponse } from "../Models/MessageResponse";

const NewFieldGame = () => {
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();


    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<MessageResponse>();
    const { eventId: eventId } = useParams<{ eventId: string }>();

    const addNewFieldGame = async (event: React.FormEvent) => {
        event.preventDefault();
        try{
            const response = await fetch(`${API_BASE_URL}/fieldGames/createNewFieldGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    eventId: eventId
                })
            });
            if(response.status === 400){
                setError("Wystąpił błąd podczas tworzenia gry terenowej.");
            }
            if(response.status === 201 || response.status === 200){
                setMessage(await response.json());
            }
        }
        catch(e: any){
            throw e;
        }
    };


    return (
        <>
        <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Utwórz nową grę terenową</h2>
            <form onSubmit={addNewFieldGame}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Nazwa</label>
                    <input
                        className='text-black'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Opis</label>
                    <input
                        className='text-black'
                        type="text"
                        value={description}
                        onChange={(e) => setDescrpition(e.target.value)}
                        required
                    />
                </div>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                {message && <p className='mb-8 text-green-800 text-2xl'>{message.message}</p>}
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Stwórz nowe wydarzenie</button>
            </form>
            <button className="bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown" type="submit" onClick={() => navigate('/dashboard')}>Wróć do panelu głównego</button>
        </div>
        </>
    );
};

export default NewFieldGame;