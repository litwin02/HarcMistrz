import { useApi } from "../../ApiContext";
import { getTeamMembers, TeamMember, deleteTeamMember, deleteTeam } from "../API/team";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { SharedH2 } from "../shared/shared-h2";
import { ReturnButton } from "../shared/shared-return-button";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { YellowButton } from "../shared/yellow_button";
import { RedButton } from "../shared/red-button";
import { useNavigate } from "react-router-dom";
import { ButtonContainer } from "../shared/button-container";


const ManageTeam = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>();
    const API_BASE_URL = useApi();
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();

    // get team members
    useEffect(() => {
        const apiResponse = getTeamMembers(API_BASE_URL, parseInt(teamId!));
        apiResponse.then((response) => {
            setTeamMembers(response);
        });
    }, [teamId!]);

    const handleDeleteMember = async (scoutId: number) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć harcerza z drużyny?");
        if (!confirmDelete) {
            return;
        }
        const message = deleteTeamMember(API_BASE_URL, parseInt(teamId!), scoutId);
        message.then((response) => {
            if (response.message === "Usunięto harcerza z drużyny!") {
                const newMembers = teamMembers?.filter((member) => member.scoutId !== scoutId);
                setTeamMembers(newMembers);
                window.alert("Usunięto harcerza z drużyny!");
            }
        });
    };

    const handleDeleteTeam = async () => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć drużynę?");
        if (!confirmDelete) {
            return;
        }
        const message = deleteTeam(API_BASE_URL, parseInt(teamId!));
        message.then((response) => {
            if (response.success) {
                navigate("/dashboard");
            }
        });
    };

    return (
        <MainBox>
            <MainPageHeader>Zarządzaj zespołem</MainPageHeader>
            <WhiteBoxColumn>
                <WhiteBox>
                    <SharedH2>Zarządzaj zespołem</SharedH2>
                    <ButtonContainer>
                        <YellowButton onClick={() => {navigate("/edit-team")}}>Zmień nazwę zespołu</YellowButton>
                        <RedButton onClick={() => {handleDeleteTeam()}}>Usuń zespół</RedButton>
                    </ButtonContainer>
                </WhiteBox>
                <WhiteBox>
                    <SharedH2>Lista członków zespołu</SharedH2>
                    <table className="table-auto w-full mt-4 text-left min-w-max">
                        <thead className="bg-gray-200">
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Email</th>
                                <th>Usuń z drużyny</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers?.map((member) => (
                                <tr key={member.scoutId} className="border-b border-gray-500 mb-2">
                                    <td>{member.firstName}</td>
                                    <td>{member.lastName}</td>
                                    <td>{member.email}</td>
                                    <td className="text-red-500">
                                        <button onClick={() => handleDeleteMember(member.scoutId)}>Usuń</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>                
                    </WhiteBox>
                <ReturnButton to="/dashboard">Wróć do panelu głównego</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default ManageTeam;