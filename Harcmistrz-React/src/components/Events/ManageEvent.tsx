import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useApi } from '../../ApiContext';
import { Event } from '../Models/EventModel';
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import { MainBox } from '../shared/main-box';
import { MainPageHeader } from '../shared/main-page-header';
import { WhiteBoxColumn } from '../shared/white-box-column';
import { WhiteBox } from '../shared/white-box';
import { SharedP } from '../shared/shared-p';
import { BoldText } from '../shared/bold-text';
import { GreenButton } from '../shared/shared-green-button';
import { YellowButton } from '../shared/yellow_button';
import { RedButton } from '../shared/red-button';
import { ButtonContainer } from '../shared/button-container';
import { ReturnButton } from '../shared/shared-return-button';


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
        if (response.status == 404) {
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
        if (confirmDelete) {
            try {
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
        if (confirmDelete) {
            try {
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
        <MainBox>
            <MainPageHeader>Nazwa wydarzenia: {eventData?.name}</MainPageHeader>
            <WhiteBoxColumn>
                {eventData &&
                    <WhiteBox>
                        <SharedP><BoldText>Opis:</BoldText> {eventData.description}</SharedP>
                        <SharedP><BoldText>Data:</BoldText> {eventData.date.format('DD-MM-YYYY HH:mm')}</SharedP>
                        <SharedP><BoldText>Lokalizacja:</BoldText> {eventData.location}</SharedP>
                        <ButtonContainer>
                            <YellowButton onClick={() => navigate(`/edit-event/${eventData.id}`)}>Edytuj wydarzenie</YellowButton>
                            <RedButton onClick={handleDeleteEvent}>Usuń wydarzenie</RedButton>
                        </ButtonContainer>

                    </WhiteBox>
                }

                {fieldGamesIsLoading && <SharedP>Ładowanie...</SharedP>}
                {fieldGamesError && <SharedP>{fieldGamesError.message}</SharedP>}

                {fieldGames?.length > 0 ?
                    (fieldGames.map((fieldGame: any) => {
                        return <WhiteBox key={fieldGame.id}>
                            <SharedP><BoldText>Nazwa:</BoldText> {fieldGame.name}</SharedP>
                            <SharedP><BoldText>Opis:</BoldText> {fieldGame.description}</SharedP>
                            <ButtonContainer>
                                <YellowButton onClick={() => navigate(`/edit-field-game/${eventData.id}/${fieldGame.id}`)}>Edytuj grę terenową</YellowButton>
                                <RedButton onClick={() => handleDeleteFieldGame(fieldGame.id)}>Usuń grę terenową</RedButton>
                                <YellowButton onClick={() => navigate(`/qr-codes/${eventData.id}/${fieldGame.id}`)}>Zarządzaj kodami QR</YellowButton>
                                <GreenButton onClick={() => navigate("")}>Aktywuj grę</GreenButton>
                            </ButtonContainer>
                        </WhiteBox>

                    })
                    ) : (
                        <WhiteBox>
                            <SharedP>Brak gier terenowych dla tego wydarzenia.</SharedP>
                            <ButtonContainer><GreenButton onClick={() => navigate(`/new-field-game/${eventData.id}`)}>Dodaj grę terenową</GreenButton></ButtonContainer>
                        </WhiteBox>
                    )}
                <ReturnButton to="/dashboard">Wróć do panelu głównego</ReturnButton>
            </WhiteBoxColumn>

        </MainBox>
    );
};

export default ManageEvent;