import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../Models/User"
import { Roles } from "../Models/Roles";

interface RegisterResponse{
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

        try{
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
                if(data.role === Roles.ADMIN) {
                    navigate('/admin');
                }
                else if(data.role === Roles.TEAM_LEADER) {
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

    return(
        <>
            <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Zarejestruj się</h2>
            <form onSubmit={handleRegistration}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Imię:</label>
                    <input
                        className='text-black'
                        type="text"
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Nazwisko:</label>
                    <input
                        className='text-black'
                        type="text"
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Email:</label>
                    <input
                        className='text-black'
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Hasło:</label>
                    <input
                        className='text-black'
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Numer telefonu:</label>
                    <input
                        className='text-black'
                        type="tel"
                        maxLength={9}
                        value={user.phoneNumber}
                        onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                        required
                    />
                </div>
                <div className='text-2xl mb-8'>
                    <label className='mr-5'>Rola</label>
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
                </div>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Zarejestruj się</button>
            </form>
            </div>
        </>
    );
};


export default RegisterForm;