import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useApi } from '../../ApiContext';
import { Event } from '../Models/EventModel';
import dayjs from "dayjs";
import Header from '../Partials/Header';
import { useNavigate } from 'react-router-dom';


const ManageEvent = () => {
    const navigate = useNavigate();

    const API_BASE_URL = useApi();
    const getEvent = async (id: string): Promise<Event> => {
        const response = await fetch(`${API_BASE_URL}/events/getEventById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać wydarzenia");
        }
        const responseJson = await response.json();
        responseJson.date = dayjs(responseJson.date);
        return responseJson;
    };

    const getFieldGames = async (id: string): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/fieldGames/getAllFieldGamesByEventId/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(response.status == 404){
            throw new Error("Brak gier terenowych dla tego wydarzenia.");
        }
        if (!response.ok) {
            throw new Error("Nie udało się pobrać gier terenowych");
        }
        const responseJson = await response.json();
        return responseJson;
    };


    const { id } = useParams<{ id: string }>();
    const { data: eventData } = useQuery<any, Error>(
        ['event', id],
        () => getEvent(id!),
        { enabled: !!id }
    );

    const { data: fieldGames, error: fieldGamesError, isLoading: fieldGamesIsLoading } = useQuery<any, Error>(
        ['fieldGames', id],
        () => getFieldGames(id!),
        { enabled: !!id }
    );

    const handleDeleteFieldGame = async (fieldGameId: string) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć tę grę terenową? UWAGA! Usunięcie gry terenowej spowoduje usunięcie wszystkich powiązanych z nią kodów QR.");
        if(confirmDelete){
            try{
                const response = await fetch(`${API_BASE_URL}/fieldGames/deleteFieldGame/${fieldGameId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Nie udało się usunąć gry terenowej");
                }
                alert("Gra terenowa została usunięta.");
                window.location.reload();
            }
            catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteEvent = async () => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć to wydarzenie? UWAGA! Usunięcie wydarzenia spowoduje usunięcie wszystkich powiązanych z nim gier terenowych i kodów QR.");
        if(confirmDelete){
            try{
                const response = await fetch(`${API_BASE_URL}/events/deleteEvent/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Nie udało się usunąć wydarzenia");
                }
                alert("Wydarzenie zostało usunięte.");
                navigate("/dashboard");
            }
            catch (error) {
                console.error(error);
            }
        };
    };
    
    return (
        <>
            <Header />
            <main className='bg-a_yellow'>
                <div className='container mx-auto py-10 flex flex-col justify-center items-center'>
                    <h1 className='text-3xl text-center text-white'>Nazwa wydarzenia: {eventData?.name}</h1>
                    <div className="w-1/2 flex flex-col justify-between bg-white p-5 rounded-lg mt-10">
                        <p>Opis: {eventData?.description}</p>
                        <p>Data: {eventData?.date?.format('DD-MM-YYYY HH:mm')}</p>
                        <p>Lokalizacja: {eventData?.location}</p>
                        <button className="w-1/4 mt-1 bg-p_green py-1 rounded text-white hover:text-s_brown" onClick={() => navigate(`/edit-event/${eventData?.id}`)}>Edytuj wydarzenie</button>
                        <button className="w-1/4 mt-1 bg-red-500 py-1 rounded text-white hover:text-s_brown" onClick={handleDeleteEvent}>Usuń wydarzenie</button>
                    </div>
                    <div className="w-1/2 bg-white p-5 rounded-lg mt-10">
                        <h2 className="text-xl">Gry terenowe:</h2>
                        {fieldGamesIsLoading && <p>Ładowanie...</p>}
                        {fieldGamesError && <p>{fieldGamesError.message}</p>}
                        {fieldGames?.length > 0 ? (fieldGames.map((fieldGame: any) => {
                            return <div key={fieldGame.id} className="w-1/2 flex flex-col justify-between mb-5">
                                <p>Nazwa: {fieldGame.name}</p>
                                <p>Opis: {fieldGame.description}</p>
                                <button className="w-1/2 mt-1 bg-a_yellow py-1 rounded text-white hover:text-s_brown" 
                                onClick={() => navigate(`/edit-field-game/${eventData.id}/${fieldGame.id}`)}>Edytuj grę terenową</button>
                                <button className="w-1/2 mt-1 bg-red-500 py-1 rounded text-white hover:text-s_brown"
                                onClick={() => handleDeleteFieldGame(fieldGame.id)}>Usuń grę terenową</button>
                                <button className="w-1/2 mt-1 bg-a_yellow py-1 rounded text-white hover:text-s_brown" onClick={() => navigate(`/qr-codes/${eventData.id}/${fieldGame.id}`)}>Zarządzaj kodami QR</button>
                                <button className="w-1/2 mt-1 bg-p_green py-1 rounded text-white hover:text-s_brown" onClick={() => navigate("")}>Aktywuj grę</button>
                            </div>
                        }) ) : 
                        <button className="w-1/4 mt-1 bg-p_green py-1 rounded text-white hover:text-s_brown" 
                        onClick={() => navigate(`/new-field-game/${eventData?.id}`)}>Dodaj grę terenową</button>}
                    </div>
                    <button className="bg-p_green p-2 text-xl mt-4 rounded text-white" onClick={() => navigate('/dashboard')}>Powrót do panelu głównego</button>
                </div>

            </main>
        </>
    );
};

export default ManageEvent;