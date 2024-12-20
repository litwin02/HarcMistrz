import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { MessageResponse } from "../Models/MessageResponse";
import { FormDiv } from "../shared/form-div";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { MainBox } from "../shared/main-box";
import { FormLabel } from "../shared/form-label";
import { WhiteBox } from "../shared/white-box";
import { GreenButton } from "../shared/shared-green-button";
import { ButtonContainer } from "../shared/button-container";
import { ReturnButton } from "../shared/shared-return-button";

const NewFieldGame = () => {
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();


    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<MessageResponse>();
    const { eventId: eventId } = useParams<{ eventId: string }>();

    const addNewFieldGame = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/fieldGames/createNewFieldGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    eventId: eventId
                })
            });
            if (response.status === 400) {
                setError("Wystąpił błąd podczas tworzenia gry terenowej.");
            }
            if (response.status === 201 || response.status === 200) {
                setMessage(await response.json());
            }
        }
        catch (e: any) {
            throw e;
        }
    };


    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Stwórz nową grę terenową</MainPageHeader>
                <WhiteBox>

                    <form onSubmit={addNewFieldGame}>
                        <FormDiv>
                            <FormLabel>Nazwa gry terenowej</FormLabel>
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
                        {error && <p className='mb-4 text-red-800 text-2xl'>{error}</p>}
                        {message && <p className='mb-4 text-green-800 text-2xl'>{message.message}</p>}
                        <ButtonContainer>
                            <GreenButton type="submit">Stwórz nową grę terenową</GreenButton>
                        </ButtonContainer>
                    </form>
                </WhiteBox>
                <ReturnButton to={`/event/${eventId}`}>Wróć do zarządzania wydarzeniem</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default NewFieldGame;