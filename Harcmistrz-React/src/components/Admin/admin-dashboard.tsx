import { useNavigate } from "react-router-dom";
import { ButtonContainer } from "../shared/button-container";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { SharedH2 } from "../shared/shared-h2";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { YellowButton } from "../shared/yellow_button";

function AdminDashboard() {
    const naviagte = useNavigate();

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Panel administratora</MainPageHeader>
                <WhiteBox>
                    <SharedH2>Przejdź do odpowiednich stron zarządzania stroną</SharedH2>
                    <ButtonContainer>
                        <YellowButton onClick={() => naviagte("/manage-users")}>Zarządzaj użytkownikami</YellowButton>
                        <YellowButton onClick={() => naviagte("/manage-teams")}>Zarządzaj drużynami</YellowButton>
                    </ButtonContainer>
                </WhiteBox>
            </WhiteBoxColumn>
        </MainBox>
    );
}

export default AdminDashboard;