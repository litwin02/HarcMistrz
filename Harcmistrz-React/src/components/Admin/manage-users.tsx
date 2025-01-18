import { useApi } from "../../ApiContext";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { ReturnButton } from "../shared/shared-return-button";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { useEffect, useState } from "react";
import { YellowButton } from "../shared/yellow_button";
import { RedButton } from "../shared/red-button";
import { useNavigate } from "react-router-dom";
import { ButtonContainer } from "../shared/button-container";
import { DeleteUser, GetAllUsers, UserInformation } from "../API/user";
import { SharedP } from "../shared/shared-p";

const ManageUsers = () => {
    const [users, setUsers] = useState<UserInformation[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserInformation[]>([]);
    const API_BASE_URL = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await GetAllUsers(API_BASE_URL);
            setUsers(response);
            setFilteredUsers(response);
        };
        fetchUsers();
    }, [API_BASE_URL]);

    const handleDeleteUser = async (userId: number) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć użytkownika?");
        if (!confirmDelete) return;

        const response = await DeleteUser(API_BASE_URL, userId.toString());
        if (response.success) {
            setUsers(users.filter(user => user.id !== userId));
            window.alert("Użytkownik został usunięty!");
        }
    };

    return (
        <MainBox>
            <MainPageHeader>Zarządzanie Użytkownikami</MainPageHeader>
            <WhiteBoxColumn>
                <WhiteBox>
                    <SharedP>Filtrowanie po roli:</SharedP>
                    <select
                        className="p-2 border rounded"
                        onChange={(e) => {
                            if (e.target.value === 'ALL') {
                                setFilteredUsers(users);
                            } else {
                                const filtered = users.filter(u => u.role === e.target.value);
                                setFilteredUsers(filtered);
                            }
                        }}
                    >
                        <option value="ALL">Wszystkie</option>
                        <option value="TEAM_LEADER">Drużynowy</option>
                        <option value="SCOUT">Harcerz</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                    <table className="table-auto w-full mt-4 text-left min-w-max">
                        <thead className="bg-gray-200">
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Email</th>
                                <th>Rola</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-500 mb-2">
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.role === 'TEAM_LEADER' ? 'Drużynowy' : user.role === 'SCOUT' ? 'Harcerz' : user.role === 'ADMIN' ? 'Administrator' : 'Nieznana rola'}
                                    </td>
                                    <td>
                                        <ButtonContainer>
                                            <YellowButton onClick={() => navigate(`/edit-profile/${user.id}`)}>
                                                Edytuj
                                            </YellowButton>
                                            <RedButton onClick={() => handleDeleteUser(user.id)}>
                                                Usuń
                                            </RedButton>
                                        </ButtonContainer>
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

export default ManageUsers;