import { useApi } from "../../ApiContext";
import { useState } from "react";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import Header from "../Partials/Header";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Event } from "../Models/EventModel";

const UserDashboard = () => {
    const API_BASE_URL = useApi();
    const navigate = useNavigate();
    const userId = localStorage.getItem("id");
    const [team, setTeam] = useState<BasicTeamResponse>();
    const [events, setEvents] = useState<Event[]>();

    const getTeam = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/teams/getTeamByScoutId/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać drużyny");
            }
            const responseJson = await response.json();
            setTeam(responseJson);
        } catch (error) {
            console.error(error);
        }
    };

    const { } = useQuery<any, Error>(
        ['team', userId],
        () => getTeam(),
        { enabled: !!userId }
    );

    const getEvents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/getEventsByScoutId/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać wydarzeń");
            }
            const responseJson = await response.json();
            setEvents(responseJson);
        } catch (error) {
            console.error(error);
        }
    };

    const { } = useQuery<any, Error>(
        ['events', userId],
        () => getEvents(),
        { enabled: !!userId }
    );

    return (
        <>
            <Header />
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10">
                    <h1 className="text-3xl text-center">Panel użytkownika</h1>
                    <div className="flex flex-col justify-center items-center mt-5">
                        <div className="w-1/2 bg-white p-5 rounded-lg">
                            <h2 className="text-2xl text-center">Twoja drużyna:</h2>
                            <div className="flex justify-left mt-5">
                                <div>
                                    {team ? (
                                        <div>
                                            <p className="text-lg font-bold">Nazwa drużyny:</p>
                                            <p>{team.name}</p>
                                            <p className="text-lg font-bold">Lider drużyny:</p>
                                            <p>{team.teamLeaderName}</p>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center grid grid-col-1">
                                            <p className="text-lg">Nie jesteś przypisany do żadnej drużyny</p>
                                            <button className="bg-p_green p-1 mt-1 rounded text-white" onClick={() => navigate(`/join-team`)}>Dołącz do drużyny</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 bg-white p-5 rounded-lg mt-5">
                            <h2 className="text-2xl text-center">Twoje wydarzenia:</h2>
                            <div className="flex justify-left mt-5">
                                <div>
                                    {events ? (
                                        <div>
                                            {events.map((event, index) => (
                                                <div key={index}>
                                                    <p className="text-lg font-bold">Nazwa wydarzenia:</p>
                                                    <p>{event.name}</p>
                                                    <p className="text-lg font-bold">Data wydarzenia:</p>
                                                    <p>{event.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-lg">Nie jesteś przypisany do żadnych wydarzeń</p>
                                            <button className="bg-p_green p-1 mt-1 rounded text-white" onClick={() => navigate(`/avaliable-events/${team?.id}`)}>Przeglądaj wydarzenia</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default UserDashboard;
