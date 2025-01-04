import { useState } from "react";
import { ButtonContainer } from "../shared/button-container";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { GreenButton } from "../shared/shared-green-button";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { Message } from "../shared/message";
import { MessageResponse } from "../Models/MessageResponse";
import { ReturnButton } from "../shared/shared-return-button";
import { ChangePassword } from "../API/user";
import { useApi } from "../../ApiContext";
import { set } from "date-fns";


const EditPassword = () => {
    const API_BASE_URL = useApi();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [message, setMessage] = useState<MessageResponse | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== repeatPassword) {
            setMessage({ message: "Nowe hasła nie są takie same", success: false });
            return;
        }
        const changePasswordRequest = {
            email: localStorage.getItem('email')!,
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        try{
            const response = ChangePassword(API_BASE_URL, changePasswordRequest);
            response.then((response) => {
                if (response.ok) {
                    setMessage({ message: "Hasło zostało zmienione!", success: true });
                    setOldPassword('');
                    setNewPassword('');
                    setRepeatPassword('');
                }
                else {
                    setMessage({ message: "Nie udało się zmienić hasła. Sprawdź stare hasło.", success: false });
                }
            });
        }
        catch(e)
        {
            setMessage({ message: "Nie udało się zmienić hasła. Sprawdź stare hasło.", success: false });
            throw new Error("Nie udało się zmienić hasła. Sprawdź stare hasło.");
        }
    }

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Edytuj hasło</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={handleSubmit}>
                        <FormDiv>
                            <FormLabel>Stare hasło</FormLabel>
                            <input type="password" className="mt-1 p-2 rounded-md w-full border" required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}>
                            </input>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Nowe hasło</FormLabel>
                            <input type="password" className="mt-1 p-2 rounded-md w-full border" required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}>
                            </input>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Powtórz nowe hasło</FormLabel>
                            <input type="password" className="mt-1 p-2 rounded-md w-full border" required
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}>
                            </input>
                        </FormDiv>
                        <ButtonContainer>
                            <GreenButton type="submit">Zmień hasło</GreenButton>
                        </ButtonContainer>
                    </form>
                </WhiteBox>
                <Message>{message && message.message}</Message>
                <ReturnButton to="/user-profile">Powrót do profilu</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default EditPassword;