import dayjs from "dayjs";
import { useApi } from "../../ApiContext";
import { Event } from "../Models/EventModel";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FieldGameDTO } from "../Models/FieldGameDTO";

const EventDetails = () => {
    const API_BASE_URL = useApi();
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event>();
    const [fieldGame, setFieldGame] = useState<FieldGameDTO>();

    const getEventById = async (eventId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/getEventById/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać wydarzeń");
            }
            const fetchedEvent = await response.json();
            fetchedEvent.date = dayjs(fetchedEvent.date).format('DD-MM-YYYY HH:mm');
            return fetchedEvent;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (eventId) {
            getEventById(parseInt(eventId)).then(fetchedEvent => setEvent(fetchedEvent));
        }
    }, [eventId]);

    const getFieldGameByEventId = async (eventId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldGames/getFieldGameByEventId/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać gier terenowych.");
            }
            const fetchedFieldGames = await response.json();
            return fetchedFieldGames;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (eventId) {
            getFieldGameByEventId(parseInt(eventId)).then(fetchedFieldGame => setFieldGame(fetchedFieldGame));
        }
    }, [eventId]);
    

    return (
        <>
            <main className="bg-a_yellow">
                <div className="container mx-auto py-10">
                    <h1 className="text-3xl text-center">Szczegóły wydarzenia</h1>
                    <div className="flex flex-col justify-center items-center mt-5">
                        <div className="w-1/2 bg-white p-5 rounded-lg">
                            <div className="flex justify-left mt-5">
                                {event && (
                                    <div>
                                        <h2 className="text-2xl font-bold">{event.name}</h2>
                                        <p className="text-lg">{event.description}</p>
                                        <p className="text-lg">Data: {event.date}</p>
                                        <p className="text-lg">Lokalizacja: {event.location}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-left mt-5">
                                {fieldGame && (
                                    <div>
                                        <h2 className="text-2xl font-bold">Gra terenowa:</h2>
                                        <p className="text-lg">Nazwa: {fieldGame.name}</p>
                                        <p className="text-lg">Opis: {fieldGame.description}</p>
                                        <p className="text-lg">Czy jest aktywowana: {fieldGame.isActivated}</p>
                                        {fieldGame.isActivated && (
                                            <button className="bg-p_green text-white p-2 rounded-lg mt-5">Rozpocznij grę!</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default EventDetails;
