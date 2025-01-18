import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { GetAllTeams } from "../API/team";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { deleteTeam } from "../API/team";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { SharedH2 } from "../shared/shared-h2";
import { ReturnButton } from "../shared/shared-return-button";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { useEffect, useState } from "react";
import { YellowButton } from "../shared/yellow_button";
import { RedButton } from "../shared/red-button";

const ManageTeams = () => {
    const [teams, setTeams] = useState<BasicTeamResponse[]>();
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const apiResponse = GetAllTeams(API_BASE_URL);
        apiResponse.then((response) => {
            setTeams(response);
        });
    }, []);

    const handleDeleteTeam = async (teamId: number) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć drużynę?");
        if (!confirmDelete) {
            return;
        }
        const message = deleteTeam(API_BASE_URL, teamId);
        message.then((response) => {
            if (response.success) {
                const newTeams = teams?.filter((team) => team.id !== teamId);
                setTeams(newTeams);
            }
        });
    };

    return (
        <MainBox>
            <MainPageHeader>Zarządzaj drużynami</MainPageHeader>
            <WhiteBoxColumn>
                <WhiteBox>
                    <SharedH2>Lista drużyn</SharedH2>
                    <table className="table-auto w-full mt-4 text-left min-w-max">
                        <thead className="bg-gray-200">
                            <tr>
                                <th>Nazwa</th>
                                <th>Kod</th>
                                <th>Drużynowy</th>
                                <th>Zarządzaj</th>
                                <th>Wydarzenia</th>
                                <th>Usuń</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams?.map((team) => (
                                <tr key={team.id} className="border-b border-gray-500 mb-2">
                                    <td>{team.name}</td>
                                    <td>{team.joinCode}</td>
                                    <td>{team.teamLeaderName}</td>
                                    <td>
                                        <YellowButton onClick={() => navigate(`/manage-team/${team.id}`)}>
                                            Zarządzaj
                                        </YellowButton>
                                    </td>
                                    <td>
                                        <YellowButton onClick={() => navigate(`/manage-events/${team.id}`)}>
                                            Wydarzenia
                                        </YellowButton>
                                    </td>
                                    <td>
                                        <RedButton onClick={() => handleDeleteTeam(team.id)}>
                                            Usuń
                                        </RedButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </WhiteBox>
                <ReturnButton to="/admin">Wróć do panelu głównego</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default ManageTeams;