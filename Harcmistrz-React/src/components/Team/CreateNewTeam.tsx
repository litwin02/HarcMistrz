import { useState } from "react";
import { useApi } from "../../ApiContext";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { WhiteBox } from "../shared/white-box";
import { MainPageHeader } from "../shared/main-page-header";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { SharedP } from "../shared/shared-p";
import { Message } from "../shared/message";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";
import { SharedH2 } from "../shared/shared-h2";
import { BoldText } from "../shared/bold-text";

const NewTeam = () => {
    const teamLeaderId = Number(localStorage.getItem('id'));
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();

    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState<string>('');
    const [joinCode, setJoinCode] = useState<string | null>(null);

    const createNewTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/teams/createNewTeam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ teamLeaderId, teamName })
            });

            if (!response.ok) {
                throw new Error("Nie udało się stworzyć nowej drużyny!");
            }
            const responseData: string = await response.text();
            if (responseData.length < 5 || responseData == null) {
                throw new Error("Nie udało się poprawnie stworzyć nowej drużyny!");
            }

            setJoinCode(responseData);

        }
        catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Stwórz nowy zespół</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={createNewTeam}>
                        <FormDiv>
                            <FormLabel>Nazwij swój zespół</FormLabel>
                            <input
                                className="mt-1 p-2 rounded-md w-full border"
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </FormDiv>
                        <SharedP>Stworzymy unikalny kod dla Twojego zespołu.
                            Inni członkowie zespołu będą go mogli podać, aby dołączyć do twojej drużyny.</SharedP>
                        {error && <Message>{error}</Message>}
                        {!joinCode && <GreenButton type="submit">Stwórz nowy zespół</GreenButton>}
                        {joinCode && <SharedH2>Twój kod zespołu: <BoldText>{joinCode}</BoldText></SharedH2>}
                    </form>
                </WhiteBox>
                {joinCode && <ReturnButton to="/dashboard">Wróć do panelu głównego</ReturnButton>}
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default NewTeam;