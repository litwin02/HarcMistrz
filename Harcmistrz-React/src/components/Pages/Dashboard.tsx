import Header from "../Partials/Header";
import { useState, useEffect } from "react";
import { useApi } from "../../ApiContext";
import { useNavigate } from "react-router-dom";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import dayjs from "dayjs";

const Dashboard = () => {
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [team, setTeam] = useState<BasicTeamResponse>();
    const [events, setEvents] = useState<any[]>();

    useEffect(() => {
        if (role === 'TEAM_LEADER') {
            const fetchData = async () => {
                setError(null);
                try {
                    const fetchedTeam = await getTeamForLeader();
                    
                    if (fetchedTeam) {
                        await getEventsForLeader(fetchedTeam.id);
                    }
                } catch (e: any) {
                    throw e;
                }
            };
    
            fetchData();
        }
    }, [role]);

    const navigateToTeamManagement = () => {
        navigate(`/team/${team?.id}`);
    }

    const navigateToEventManagement = (id: string) => {
        navigate(`/event/${id}`);
    }

    const getTeamForLeader = async () => {
        setError(null);

        try{
            const response = await fetch(`${API_BASE_URL}/teams/getTeamByTeamLeaderId/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
            });
            if(response.status === 404){
                setError("Nie znaleziono żadnej drużyny!");
            }
            const fetchedTeam = await response.json();
            setTeam(fetchedTeam);
            return fetchedTeam;
        }
        catch(e: any){
            throw e;
        }
    }

    const getEventsForLeader = async (teamId: number) => {
        setError(null);

        try{
            const response = await fetch(`${API_BASE_URL}/events/getAllEventsByTeamId/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
            });
            if(response.status === 404){
                setError("Nie znaleziono żadnych wydarzeń!");
            }
            const fetchedEvents = await response.json();
            fetchedEvents.forEach((event: any) => {
                event.date = dayjs(event.date).format('DD-MM-YYYY HH:mm');
            });
            setEvents(fetchedEvents);            
        }
        catch(e: any){
            throw e;
        }
    }

    return(
        <>
        <Header />
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10">
                    <h1 className="text-3xl text-center">Witaj w centrum dowodzenia</h1>
                    <div className="flex flex-col justify-center items-center mt-10">
                        {team && 
                        <div className="w-1/2 bg-white p-5 rounded-lg mb-10">
                            <h2 className="text-xl">Twoje drużyna:</h2>
                            <p>Zespół: {team.name}</p>
                            <p>Kod zespołu: {team.joinCode}</p>
                            <button className="bg-a_yellow p-1 mt-1 rounded hover:text-s_brown" onClick={(navigateToTeamManagement)}>Zarządzaj swoją drużyną</button>
                        </div>
                        }
                        {team && 
                        <div className="w-1/2 bg-white p-5 rounded-lg mb-10">
                            <h2 className="text-xl">Twoje wydarzenia:</h2>
                            {!events && <p>Brak wydarzeń</p>}
                            {events && events.map((event) => {
                                return <div key={event.id} className="w-1/2 flex flex-col justify-between mb-5">
                                    <p>Nazwa: {event.name}</p>
                                    <p>Opis: {event.description}</p>
                                    <p>Lokalizacja: {event.location}</p>
                                    <p>Data: {event.date}</p>
                                    <button className="w-1/2 mt-1 bg-p_green py-1 rounded text-white hover:text-s_brown" onClick={() => navigateToEventManagement(event.id)}>Zarządzaj wydarzeniem</button>
                                </div>
                            })}
                            <button className="bg-p_green p-1 mt-1 rounded text-white" onClick={() => navigate('/create-new-event')}>Stwórz nowe wydarzenie</button>
                        </div>
                        }
                        {error && <p className="text-red-800">{error}</p>}
                        {!team && <button className="bg-p_green p-2 text-xl mt-4 rounded text-white" onClick={() => navigate('/create-new-team')}>Stwórz nową drużynę</button>}
                    </div>
                    
                </div>
            </main>
        </>
    )
}

export default Dashboard;