import dayjs from "dayjs";
import { useApi } from "../../ApiContext";
import { Event } from "../Models/EventModel";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FieldGameDTO } from "../Models/FieldGameDTO";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { BoldText } from "../shared/bold-text";
import { WhiteBox } from "../shared/white-box";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { ReturnButton } from "../shared/shared-return-button";
import { GreenButton } from "../shared/shared-green-button";

const EventDetails = () => {
    const API_BASE_URL = useApi();
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event>();
    const [fieldGame, setFieldGame] = useState<FieldGameDTO>();
    const navigate = useNavigate();

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
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Szczegóły wydarzenia: <BoldText>{event?.name}</BoldText></MainPageHeader>
                <WhiteBox>
                    {event && (
                        <div>
                            <SharedP>Opis: <BoldText>{event.description}</BoldText></SharedP>
                            <SharedP>Data: <BoldText>{event.date}</BoldText></SharedP>
                            <SharedP>Lokalizacja: <BoldText>{event.location}</BoldText></SharedP>
                        </div>
                    )}
                </WhiteBox>
                <WhiteBox>
                    {fieldGame && (
                        <div>
                            <SharedH2>Gra terenowa:</SharedH2>
                            <SharedP>Nazwa: <BoldText>{fieldGame.name}</BoldText></SharedP>
                            <SharedP>Opis: <BoldText>{fieldGame.description}</BoldText></SharedP>
                            <SharedP>Czy jest aktywowana: {fieldGame.isActivated ? "Tak" : "Nie"}</SharedP>
                            {fieldGame.isActivated && (
                               <GreenButton onClick={() => navigate(`/play-field-game/${eventId}/${fieldGame.id}`)}>Przejdź do gry</GreenButton>
                            )}
                        </div>
                    )}
                </WhiteBox>
                <ReturnButton to="/user-dashboard">Wróć na stronę główną</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default EventDetails;
