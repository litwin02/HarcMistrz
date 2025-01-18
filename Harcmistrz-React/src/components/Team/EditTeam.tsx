import { useEffect, useState } from "react";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { useApi } from "../../ApiContext";
import { editTeam, GetTeamById, getTeamByTeamLeaderId } from "../API/team";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { SharedH2 } from "../shared/shared-h2";
import { WhiteBox } from "../shared/white-box";
import { MainPageHeader } from "../shared/main-page-header";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";
import { useNavigate, useParams } from "react-router-dom";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";

const EditTeam = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [team, setTeam] = useState<BasicTeamResponse | null>(null);
    const [name, setName] = useState<string>('');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    // get team by team leader id
    useEffect(() => {
        const response = GetTeamById(API_BASE_URL, parseInt(teamId!));
        response.then((team) => setTeam(team));
    }, [teamId, API_BASE_URL]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const response = editTeam(API_BASE_URL, team!.id, name);
        response.then((response) => {
            if (response.success) {
                window.alert("Zaktualizowano nazwę drużyny!");
            }
            navigate(`/manage-team/${team?.id}`);
        });
    };

    const returnString = `/manage-team/${team?.id}`;
    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Zmień nazwę drużyny</MainPageHeader>
                <WhiteBox>
                    <SharedH2>Obecna nazwa drużyny: <strong>{team?.name}</strong></SharedH2>
                    <form onSubmit={handleSubmit}>
                        <FormDiv>
                            <FormLabel>Nazwa zespołu</FormLabel>
                            <input type="text" className="mt-1 p-2 rounded-md w-full border" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required>
                            </input>
                        </FormDiv>
                        <GreenButton type="submit">Zmień nazwę</GreenButton>
                    </form>
                </WhiteBox>
                <ReturnButton to={returnString}>Powrót do zarządzania drużyną</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default EditTeam;