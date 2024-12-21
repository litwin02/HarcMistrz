import { useNavigate } from 'react-router-dom';
import { useApi } from '../../ApiContext';
import { useState } from 'react';
import { MessageResponse } from '../Models/MessageResponse';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MainBox } from '../shared/main-box';
import { WhiteBoxColumn } from '../shared/white-box-column';
import { MainPageHeader } from '../shared/main-page-header';
import { WhiteBox } from '../shared/white-box';
import { FormDiv } from '../shared/form-div';
import { FormLabel } from '../shared/form-label';
import { Message } from '../shared/message';
import { YellowButton } from '../shared/yellow_button';
import { ReturnButton } from '../shared/shared-return-button';


const EditFieldGame = () => {
    const API_BASE_URL = useApi();

    const { eventId } = useParams<{ eventId: string }>();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();

    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');

    const [message, setMessage] = useState<MessageResponse>();
    const [error, setError] = useState<string | null>(null);

    const getFieldGame = async (id: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/fieldGames/getFieldGameById/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać gry terenowej");
            }
            const responseJson = await response.json();
            setName(responseJson.name);
            setDescrpition(responseJson.description);
            return responseJson;
        }
        catch (e: any) {
            throw e;
        }
    };

    const { data: fieldGameData } = useQuery<any, Error>(
        ['fieldGame', fieldGameId],
        () => getFieldGame(fieldGameId!),
        { enabled: !!fieldGameId }
    );

    const editFieldGame = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/fieldGames/updateFieldGame`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: fieldGameId,
                    name: name,
                    description: description
                })
            });
            if (!response.ok) {
                throw new Error("Wystąpił błąd podczas edycji gry terenowej.");
            }
            setMessage(await response.json());
        }
        catch (e: any) {
            setError(e.message);
        }
    }

    const returnString = `/event/${eventId}`;

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Edytuj grę terenową</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={editFieldGame}>
                        <FormDiv>
                            <FormLabel>Nazwa</FormLabel>
                            <input
                                className="mt-1 p-2 rounded-md w-full border"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Opis</FormLabel>
                            <input
                                className="mt-1 p-2 rounded-md w-full border"
                                type="text"
                                value={description}
                                onChange={(e) => setDescrpition(e.target.value)}
                                required
                            />
                        </FormDiv>
                        {error && <Message>{error}</Message>}
                        {message && <Message>{message.message}</Message>}
                        <YellowButton type="submit">Edytuj wydarzenie</YellowButton>
                    </form>
                </WhiteBox>
                <ReturnButton to={returnString}>Wróć do panelu wydarzenia</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default EditFieldGame;