import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../Models/User"
import { Roles } from "../Models/Roles";
import { MainBox } from "../shared/main-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { GreenButton } from "../shared/shared-green-button";
import { ReturnButton } from "../shared/shared-return-button";

interface RegisterResponse {
    id?: number;
    role?: Roles;
    token?: string;
    message?: string;
}

const RegisterForm = () => {
    const emptyUser = {} as User;
    const [user, setUser] = useState<User>(emptyUser);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                setError("Rejestracja nie powiodła się. Błędny email lub hasło.");
                throw new Error("Rejestracja nie powiodła się. Błędny email lub hasło.");
            }
            const data: RegisterResponse = await response.json();

            if (data.token && data.id && data.role) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.id.toString());
                localStorage.setItem('role', data.role.toString());
                if (data.role === Roles.ADMIN) {
                    navigate('/admin');
                }
                else if (data.role === Roles.TEAM_LEADER) {
                    navigate('/dashboard');
                }
                else {
                    navigate('/user-dashboard');
                }
            }
            else {
                setError("Rejestracja nie powiodła się. Błędny email lub hasło.");
                throw new Error("Rejestracja nie powiodła się. Błędny email lub hasło.");
            }
        }
        catch (e: any) {
            console.error(e);
        }
    };

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Zarejestruj się</MainPageHeader>
                <WhiteBox>
                    <form onSubmit={handleRegistration}>
                        <FormDiv>
                            <FormLabel>Imię</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="text"
                                value={user.firstName}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Nazwisko:</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="text"
                                value={user.lastName}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Email:</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Hasło:</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Numer telefonu:</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="tel"
                                maxLength={9}
                                minLength={9}
                                value={user.phoneNumber}
                                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Rola</FormLabel>
                            <div className='flex space-x-4'>
                                <label className='flex items-center'>
                                    <input
                                        type="radio"
                                        className='mr-2'
                                        value="SCOUT"
                                        checked={user.role === 0}
                                        onChange={() => setUser({ ...user, role: 0 })}
                                    />
                                    Harcerz
                                </label>
                                <label className='flex items-center'>
                                    <input
                                        type="radio"
                                        className='mr-2'
                                        value="TEAM_LEADER"
                                        checked={user.role === 1}
                                        onChange={() => setUser({ ...user, role: 1 })}
                                    />
                                    Drużynowy
                                </label>
                            </div>
                        </FormDiv>
                        {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                        <GreenButton type="submit">Zarejestruj się</GreenButton>
                    </form>
                </WhiteBox>
                <ReturnButton to="/">Powrót do strony głównej</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};


export default RegisterForm;