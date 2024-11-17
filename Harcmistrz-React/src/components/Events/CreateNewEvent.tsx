import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../Partials/Header"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { MessageResponse } from "../Models/MessageResponse";
import { useApi } from "../../ApiContext";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pl';
import dayjs, { Dayjs } from 'dayjs';


// TODO: Fix timezone problem, clear inputs after success


const NewEvent = () => {
    const teamLeaderId = Number(localStorage.getItem('id'));
    const userRole = localStorage.getItem('role');
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();
    useEffect(() => {
        if(userRole !== 'TEAM_LEADER'){
            navigate('/dashboard');
        }
        getTeam();
    }, []);

    const returnToDashboard = () => {
        navigate("/dashboard");
    };

    const [error, setError] = useState<string | null>(null);
    const [team, setTeam] = useState<BasicTeamResponse>();
    
    const getTeam = async () => {
        setError(null);

        try{
            const response = await fetch(`${API_BASE_URL}/teams/getTeamByTeamLeaderId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
                body: JSON.stringify({ teamLeaderId })
            });
            if(!response.ok){
                navigate("/dashboard");
            }
            setTeam(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }

    }
    
    const [message, setMessage] = useState<MessageResponse>();

    const createNewEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const teamId = team?.id;
        
        try{
            const response = await fetch(`${API_BASE_URL}/events/createNewEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
                body: JSON.stringify({ 
                    name: name,
                    description: description,
                    date: date, 
                    location: location,
                    teamId: teamId
                })
            });
            if(!response.ok){
                throw new Error("Nie udało się stworzyć nowego wydarzenia!");
            }
            setMessage(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    }

    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [location, setLocation] = useState<string>('');

    return(
        <>
        <Header />
        <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Utwórz nowe wydarzenie dla zespołu</h2>
            <form onSubmit={createNewEvent}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Nazwij to wydarzenie</label>
                    <input
                        className='text-black'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Dodaj opis tego wydarzenia</label>
                    <input
                        className='text-black'
                        type="text"
                        value={description}
                        onChange={(e) => setDescrpition(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Podaj miejsce tego wydarzenia</label>
                    <input
                        className='text-black'
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Dodaj datę tego wydarzenia</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                        <DateTimePicker
                            label="Wybierz datę"
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                        />
                    </LocalizationProvider>
                </div>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                {message && <p className='mb-8 text-green-800 text-2xl'>{message.message}</p>}
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Stwórz nowe wydarzenie</button>
                
            </form>
            <button className="bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown" type="submit" onClick={returnToDashboard}>Wróć do panelu głównego</button>
        </div>
        </>
    );
}

export default NewEvent;