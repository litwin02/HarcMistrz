import { useEffect, useState } from "react";
import { ButtonContainer } from "../shared/button-container";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { RedButton } from "../shared/red-button";
import { SharedP } from "../shared/shared-p";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { YellowButton } from "../shared/yellow_button";
import { DeleteUser, GetUserInformation, UserInformation } from "../API/user";
import { useApi } from "../../ApiContext";
import { BoldText } from "../shared/bold-text";
import { useNavigate } from "react-router-dom";


const UserProfile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("id");
    const API_BASE_URL = useApi();
    const [user, setUser] = useState<UserInformation | null>(null);
    useEffect(() => {
        async function fetchUserInformation() {
            const userInfo = await GetUserInformation(API_BASE_URL, userId!);
            setUser(userInfo);
        }
        fetchUserInformation();
    }, [userId]);

    const handleDelete = () => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć konto?");
        if (confirmDelete) {
            const response = DeleteUser(API_BASE_URL, userId!);
            response.then(() => {
                alert("Konto zostało usunięte");
                navigate("/logout");
            }).catch((e) => {
                alert("Nie udało się usunąć konta");
                throw e;
            });
        }
    }

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Twój profil</MainPageHeader>
                <WhiteBox>
                    <SharedP>Imię: <BoldText>{user?.firstName}</BoldText></SharedP>
                    <SharedP>Nazwisko: <BoldText>{user?.lastName}</BoldText></SharedP>
                    <SharedP>Email: <BoldText>{user?.email}</BoldText></SharedP>
                    <SharedP>Telefon: <BoldText>{user?.phoneNumber}</BoldText></SharedP>
                    <ButtonContainer>
                        <YellowButton onClick={() => navigate(`/edit-profile/${userId}`)}>Edytuj informacje</YellowButton>
                        <YellowButton onClick={() => navigate("/change-password")}>Zmień hasło</YellowButton>
                        <RedButton onClick={handleDelete}>Usuń konto</RedButton>
                    </ButtonContainer>
                </WhiteBox>
            </WhiteBoxColumn>
        </MainBox>
    );
}

export default UserProfile;