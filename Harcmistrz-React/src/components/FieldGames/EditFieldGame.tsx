import { useNavigate } from 'react-router-dom';
import { useApi } from '../../ApiContext';
import { useState } from 'react';
import { MessageResponse } from '../Models/MessageResponse';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';


const EditFieldGame = () => {
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    const { eventId } = useParams<{ eventId: string }>();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();

    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');

    const [message, setMessage] = useState<MessageResponse>();
    const [error, setError] = useState<string | null>(null);

    const getFieldGame = async (id: string): Promise<any> => {
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
            setName(responseJson.name);
            setDescrpition(responseJson.description);
            return responseJson;
        }
        catch(e: any){
            throw e;
        }
    };

    const { data: fieldGameData } = useQuery<any, Error>(
        ['fieldGame', fieldGameId],
        () => getFieldGame(fieldGameId!),
        { enabled: !!fieldGameId }
    );

    const editFieldGame = async (event: React.FormEvent) => {
        event.preventDefault();
        try{
            const response = await fetch(`${API_BASE_URL}/fieldGames/updateFieldGame`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: fieldGameId,
                    name: name,
                    description: description
                })
            });
            if(!response.ok){
                throw new Error("Wystąpił błąd podczas edycji gry terenowej.");
            }
            setMessage(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    }

    return (
        <>
        <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Edytuj grę terenową</h2>
            <form onSubmit={editFieldGame}>
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
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Edytuj wydarzenie</button>
            </form>
            <button className="bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown" type="submit" onClick={() => navigate(`/event/${eventId}`)}>Wróć do panelu głównego</button>
        </div>
        </>
    );
};

export default EditFieldGame;