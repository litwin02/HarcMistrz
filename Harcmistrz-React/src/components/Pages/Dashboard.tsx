import { useState, useEffect } from "react";
import { useApi } from "../../ApiContext";
import { useNavigate } from "react-router-dom";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import dayjs from "dayjs";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { WhiteBox } from "../shared/white-box";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { BoldText } from "../shared/bold-text";
import { GreenButton } from "../shared/shared-green-button";
import { YellowButton } from "../shared/yellow_button";
import { Message } from "../shared/message";

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

        try {
            const response = await fetch(`${API_BASE_URL}/teams/getTeamByTeamLeaderId/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
            });
            if (response.status === 404) {
                setError("Nie znaleziono żadnej drużyny!");
            }
            const fetchedTeam = await response.json();
            setTeam(fetchedTeam);
            return fetchedTeam;
        }
        catch (e: any) {
            throw e;
        }
    }

    const getEventsForLeader = async (teamId: number) => {
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/events/getAllEventsByTeamId/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
            });
            if (response.status === 404) {
                setError("Nie znaleziono żadnych wydarzeń!");
            }
            const fetchedEvents = await response.json();
            fetchedEvents.forEach((event: any) => {
                event.date = dayjs(event.date).format('DD-MM-YYYY HH:mm');
            });
            setEvents(fetchedEvents);
        }
        catch (e: any) {
            throw e;
        }
    }

    return (
        <MainBox>
            <MainPageHeader>Witaj w centrum dowodzenia</MainPageHeader>
            <WhiteBoxColumn>
                {team &&
                    <WhiteBox>
                        <SharedH2><BoldText>Twoja drużyna</BoldText> </SharedH2>
                        <SharedP><BoldText>Zespół:</BoldText> {team.name}</SharedP>
                        <SharedP><BoldText>Kod zespołu:</BoldText> {team.joinCode}</SharedP>
                        <GreenButton onClick={() => navigate('/create-new-event')}>Dodaj nowe wydarzenie</GreenButton>
                    </WhiteBox>
                }
                {events?.map((event) => (
                    <WhiteBox key={event.id}>
                        <SharedH2><BoldText>Nazwa:</BoldText> {event.name}</SharedH2>
                        <SharedP><BoldText>Opis:</BoldText> {event.description}</SharedP>
                        <SharedP><BoldText>Lokalizacja:</BoldText> {event.location}</SharedP>
                        <SharedP><BoldText>Data:</BoldText> {event.date}</SharedP>
                        <YellowButton onClick={() => navigateToEventManagement(event.id)}>Zarządzaj wydarzeniem</YellowButton>
                    </WhiteBox>
                ))}
                {!team && <GreenButton onClick={() => navigate('/create-new-team')}>Stwórz nową drużynę</GreenButton>}
                {error && <Message>{error}</Message>}
            </WhiteBoxColumn>
        </MainBox>

    )
}

export default Dashboard;