import { useEffect, useState } from "react";
import { ButtonContainer } from "../shared/button-container";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { EditUserInformation, GetUserInformation, UserInformation } from "../API/user";
import { useApi } from "../../ApiContext";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { GreenButton } from "../shared/shared-green-button";
import { Message } from "../shared/message";
import { MessageResponse } from "../Models/MessageResponse";
import { ReturnButton } from "../shared/shared-return-button";
import { useParams } from "react-router-dom";


const EditUserProfile = () => {
    const userId = useParams<{ id: string }>().id;
    const API_BASE_URL = useApi();
    const [user, setUser] = useState<UserInformation | null>(null);
    const role = localStorage.getItem("role");

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [message, setMessage] = useState<MessageResponse | null>(null);

    useEffect(() => {
        async function fetchUserInformation() {
            const userInfo = await GetUserInformation(API_BASE_URL, userId!);
            setUser(userInfo);
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setEmail(userInfo.email);
            setPhoneNumber(userInfo.phoneNumber);
        }
        fetchUserInformation();
    }, [userId]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userInfo: EditUserInformation = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber
        };
        const response = EditUserInformation(API_BASE_URL, userId!, userInfo);
        response.then((response) => {
            setMessage(response);
        });
    }

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Edytuj profil</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={handleSubmit}>
                        <FormDiv>
                            <FormLabel>Imię</FormLabel>
                            <input type="text" className="mt-1 p-2 rounded-md w-full border"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required>
                            </input>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Nazwisko</FormLabel>
                            <input type="text" className="mt-1 p-2 rounded-md w-full border"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required>
                            </input>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Email</FormLabel>
                            <input type="text" className="mt-1 p-2 rounded-md w-full border"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required>
                            </input>
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Telefon</FormLabel>
                            <input type="text" className="mt-1 p-2 rounded-md w-full border"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                min={9}
                                max={9}>
                            </input>
                        </FormDiv>
                        <ButtonContainer>
                            <GreenButton type="submit">Zapisz zmiany</GreenButton>
                        </ButtonContainer>
                    </form>
                </WhiteBox>
                <Message>{message && message.message}</Message>
                {role === "ADMIN" && <ReturnButton to="/manage-users">Powrót do zarządzania użytkownikami</ReturnButton>}
                {role !== "ADMIN" && <ReturnButton to="/user-profile">Powrót do profilu</ReturnButton>}
            </WhiteBoxColumn>
        </MainBox>
    );
}

export default EditUserProfile;