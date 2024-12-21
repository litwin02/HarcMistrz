import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageResponse } from "../Models/MessageResponse";
import { BasicTeamResponse } from "../Models/BasicTeamResponse"
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { SharedP } from "../shared/shared-p";
import { YellowButton } from "../shared/yellow_button";
import { SharedH2 } from "../shared/shared-h2";
import { BoldText } from "../shared/bold-text";
import { ReturnButton } from "../shared/shared-return-button";
import { GreenButton } from "../shared/shared-green-button";
import { Message } from "../shared/message";

const AddScoutToTeam = () => {

    const scoutId = Number(localStorage.getItem('id'));
    const userToken = localStorage.getItem('token');
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState<string>('');
    const [teamResponse, setTeamResponse] = useState<BasicTeamResponse>();

    const getTeamByJoinCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTeamResponse(undefined);
        
        try{
            const response = await fetch(`http://localhost:8080/api/v1/teams/getTeamByJoinCode?joinCode=${joinCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: joinCode
            });
            if(!response.ok){
                throw new Error("Nie znaleziono takiej drużyny!");
            }
            setTeamResponse(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    };

    const [message, setMessage] = useState<MessageResponse>();

    const joinTeam = async () => {
        setError(null);
        const teamId = teamResponse?.id;

        try{
            const response = await fetch('http://localhost:8080/api/v1/teams/joinTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ teamId, scoutId})
            });
            if(!response.ok){
                throw new Error("Nie udało się dodać harcerza do drużyny.");
            }
            setMessage(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    }

    const returnToDashboard = () => {
        navigate("/user-dashboard");
    };

    return (
    <MainBox>

        <WhiteBoxColumn>
            <MainPageHeader>Dołącz do drużyny</MainPageHeader>
            <WhiteBox>
            <form onSubmit={getTeamByJoinCode}>
                <FormDiv>
                    <FormLabel>Podaj kod zespołu</FormLabel>
                    <input
                        className="mt-1 p-2 rounded-md w-full border" 
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        required
                    />
                </FormDiv>
                {error && <SharedP>{error}</SharedP>}
                <YellowButton type="submit">Szukaj zespołu</YellowButton>
            </form>
            {teamResponse && <div className="mt-2"></div>}
            {teamResponse && <SharedH2>Nazwa zepsołu: <BoldText>{teamResponse.name}</BoldText></SharedH2>}
            {teamResponse && <SharedH2>Lider zespołu: <BoldText>{teamResponse.teamLeaderName}</BoldText></SharedH2>}
            {teamResponse && <GreenButton onClick={joinTeam}>Dołącz do tego zespołu</GreenButton>}
            {message && <Message>{message.message}</Message>}
            </WhiteBox>
            <ReturnButton to="/user-dashboard">Powrót do panelu użytkownika</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
  
};

export default AddScoutToTeam;