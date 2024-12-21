import { useApi } from "../../ApiContext";
import { useState } from "react";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Event } from "../Models/EventModel";
import { useEffect } from "react";
import dayjs from "dayjs";


import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { BoldText } from "../shared/bold-text";
import { GreenButton } from "../shared/shared-green-button";
import { RedButton } from "../shared/red-button";
import { YellowButton } from "../shared/yellow_button";
import { HorizontalButtonContainer } from "../shared/horizontal-button-container";

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
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    };

    const { } = useQuery<BasicTeamResponse, Error>(
        ['team', userId],
        () => getTeam(),
        { enabled: !!userId }
    );

    const getEventsToParticipate = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/event-participation/getEventParticipationByScoutId/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać wydarzeń, do których jesteś zapisany.");
            }
            const fetchData = await response.json();
            return fetchData;
        } catch (error) {
            console.error(error);
        }
    };

    const { data: eventsToParticipate } = useQuery<any[], Error>(
        ['eventsToParticipate', userId],
        () => getEventsToParticipate(),
        { enabled: !!userId }
    );

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
        const fetchEvents = async () => {
            if (eventsToParticipate) {
                const eventPromises = eventsToParticipate.map(event => getEventById(event.eventId));
                const eventsData = await Promise.all(eventPromises);
                setEvents(eventsData);
            }
        };

        fetchEvents();
    }, [eventsToParticipate]);

    const handleUnsubscribe = async (eventParticipateId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/event-participation/deleteEventParticipation/${eventParticipateId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się wypisać z wydarzenia");
            }
            const updatedEvents = events?.filter(event => event.id !== eventsToParticipate?.find(event => event.eventId === event.id)?.id);
            setEvents(updatedEvents);
            alert("Wypisałeś się z wydarzenia!");
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <MainBox>
            <MainPageHeader>Witaj w centrum dowodzenia</MainPageHeader>
            <WhiteBoxColumn>
                <WhiteBox>
                    <SharedH2>Twoja drużyna</SharedH2>
                    {team ? (
                        <div>
                            <SharedP><BoldText>Nazwa drużyny:</BoldText> {team.name}</SharedP>
                            <SharedP><BoldText>Lider drużyny:</BoldText> {team.teamLeaderName}</SharedP>
                        </div>
                    ) : (
                        <div>
                            <SharedP>Nie jesteś przypisany do żadnej drużyny</SharedP>
                            <GreenButton onClick={() => navigate(`/join-team`)}>Dołącz do drużyny</GreenButton>
                        </div>
                    )}

                </WhiteBox>
                <WhiteBox>
                    <SharedH2>Wydarzenia na które jesteś zapisany</SharedH2>

                    {events && events.length > 0 &&
                        <div>
                            {events.map((event, index) => (
                                <div key={index} className="mb-5">
                                    <SharedP><BoldText>Nazwa wydarzenia: </BoldText>{event.name}</SharedP>
                                    <SharedP><BoldText>Opis: </BoldText>{event.description}</SharedP>
                                    <SharedP><BoldText>Lokalizacja: </BoldText>{event.location}</SharedP>
                                    <SharedP><BoldText>Data wydarzenia: </BoldText>{event.date}</SharedP>
                                    <HorizontalButtonContainer>
                                        <YellowButton onClick={() => navigate(`/event-details/${event.id}`)}>Szczegóły wydarzenia</YellowButton>
                                        <RedButton onClick={() => {
                                            const eventToParticipate = eventsToParticipate?.find(e => e.eventId === event.id);
                                            if (eventToParticipate) {
                                                handleUnsubscribe(eventToParticipate.id);
                                            }
                                        }}>Wypisz się z wydarzenia</RedButton>
                                    </HorizontalButtonContainer>
                                </div>
                            ))}
                        </div>
                    }
                    <GreenButton onClick={() => navigate(`/available-events/${team?.id}`)}>Przeglądaj wydarzenia</GreenButton>
                </WhiteBox>
            </WhiteBoxColumn>
        </MainBox>

    );
};

export default UserDashboard;
