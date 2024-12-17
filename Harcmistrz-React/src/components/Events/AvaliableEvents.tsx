import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { getEventsByTeamId } from "../API/events";
import { useParams } from "react-router-dom";
import { Event } from "../Models/EventModel";
import { useState, useEffect } from "react";
import { useApi } from "../../ApiContext";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { EventParticipation, getEventParticipationsByScoutId, postEventParticipation } from "../API/event-participation";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";
import dayjs from 'dayjs';
import { BoldText } from "../shared/bold-text";
import { MessageResponse } from "../Models/MessageResponse";
import { Message } from "../shared/message";

const AvaliableEvents = () => {
    const userId = localStorage.getItem("id");
    const { teamId } = useParams<{ teamId: string }>();
    const [events, setEvents] = useState<Event[]>();
    const [eventsToParticipate, setEventsToParticipate] = useState<Event[]>();
    const [participation, setParticipation] = useState<EventParticipation[]>();
    const API_BASE_URL = useApi();

    // get events by team id
    useEffect(() => {
        getEventsByTeamId(API_BASE_URL, parseInt(teamId!)).then((events) => {
            setEvents(events);
        });
    }, [teamId!]);

    // get event participation by scout id
    useEffect(() => {
        getEventParticipationsByScoutId(API_BASE_URL, parseInt(userId!)).then((participation: EventParticipation[]) => {
            setParticipation(participation);
        });
    }, [userId!]);

    // find events that user is not participating in
    useEffect(() => {
        if (events && participation) {
            const filteredEvents = events.filter((event) => {
                return !participation.some((participation) => participation.eventId === event.id);
            });
            setEventsToParticipate(filteredEvents);
        }
    }, [events, participation]);

    const [message, setMessage] = useState<MessageResponse | null>(null);

    // add event participation
    const handleAddEventParticipation = async (eventId: number) => {
        const response = await postEventParticipation(API_BASE_URL, eventId, parseInt(userId!));
        setMessage(response);
        const participation = await getEventParticipationsByScoutId(API_BASE_URL, parseInt(userId!));
        setParticipation(participation);
    };

    return (
        <>
            <MainBox>
                <MainPageHeader>Dostępne wydarzenia:</MainPageHeader>
                <WhiteBoxColumn>
                    {events?.map((event) => (
                        <WhiteBox key={event.id}>
                            <SharedH2><BoldText>Nazwa:</BoldText> {event.name}</SharedH2>
                            <SharedP><BoldText>Opis:</BoldText> {event.description}</SharedP>
                            <SharedP><BoldText>Lokalizacja:</BoldText> {event.location}</SharedP>
                            <SharedP><BoldText>Data:</BoldText> {dayjs(event.date).format('DD-MM-YYYY HH:mm')}</SharedP>
                            {eventsToParticipate?.find((eventToParticipate) => eventToParticipate.id === event.id) && (
                                <GreenButton onClick={() => handleAddEventParticipation(event.id)}>Zapisz się</GreenButton>
                            )}
                        </WhiteBox>
                    ))}
                    {message && <Message>{message.message}</Message>}
                    <ReturnButton to="/user-dashboard">Wróć na stronę główną</ReturnButton>
                </WhiteBoxColumn>
            </MainBox>
        </>
    );
};

export default AvaliableEvents;