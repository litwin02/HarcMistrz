import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { useEffect, useState } from "react";
import { Event } from "../Models/EventModel";
import { getEventsByTeamId } from "../API/events";
import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";
import { YellowButton } from "../shared/yellow_button";
import { BoldText } from "../shared/bold-text";
import { ReturnButton } from "../shared/shared-return-button";

function ManageEvents() {
    const { teamId } = useParams<{ teamId: string }>();
    const [events, setEvents] = useState<Event[]>();
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const apiResponse = getEventsByTeamId(API_BASE_URL, parseInt(teamId!));
        apiResponse.then((response) => {
            setEvents(response);
        });
    }, []);

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Wydarzenia</MainPageHeader>

                {events?.map((event) => (
                    <WhiteBox key={event.id}>
                        <SharedH2><BoldText>Nazwa:</BoldText> {event.name}</SharedH2>
                        <SharedP><BoldText>Opis:</BoldText> {event.description}</SharedP>
                        <SharedP><BoldText>Lokalizacja:</BoldText> {event.location}</SharedP>
                        <SharedP><BoldText>Data:</BoldText> {event.date}</SharedP>
                        <YellowButton onClick={() => navigate(`/event/${event.id}`)}>Zarządzaj wydarzeniem</YellowButton>
                    </WhiteBox>
                ))}
                {events?.length === 0 && <WhiteBox><SharedP>Brak wydarzeń</SharedP></WhiteBox>}
                <ReturnButton to={`/manage-teams`}>Powrót do zarządzania drużyną</ReturnButton>
            </WhiteBoxColumn>
            
        </MainBox>
    )
}

export default ManageEvents;