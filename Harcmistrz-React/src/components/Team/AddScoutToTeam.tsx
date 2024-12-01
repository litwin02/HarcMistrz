import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../Partials/Header";
import { MessageResponse } from "../Models/MessageResponse";
import { BasicTeamResponse } from "../Models/BasicTeamResponse"

const AddScoutToTeam = () => {

    const scoutId = Number(localStorage.getItem('id'));
    const userToken = localStorage.getItem('token');
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState<string>('');
    const [teamResponse, setTeamResponse] = useState<BasicTeamResponse>();

    const getTeamByJoinCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTeamResponse(undefined);
        
        try{
            const response = await fetch(`http://localhost:8080/api/v1/teams/getTeamByJoinCode?joinCode=${joinCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: joinCode
            });
            if(!response.ok){
                throw new Error("Nie znaleziono takiej drużyny!");
            }
            setTeamResponse(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    };

    const [message, setMessage] = useState<MessageResponse>();

    const joinTeam = async () => {
        setError(null);
        const teamId = teamResponse?.id;

        try{
            const response = await fetch('http://localhost:8080/api/v1/teams/joinTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ teamId, scoutId})
            });
            if(!response.ok){
                throw new Error("Nie udało się dodać harcerza do drużyny.");
            }
            setMessage(await response.json());
        }
        catch(e: any){
            setError(e.message);
        }
    }

    const returnToDashboard = () => {
        navigate("/user-dashboard");
    };

    return (
    <>
        <Header />
        <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Dołącz do zespołu</h2>
            <form onSubmit={getTeamByJoinCode}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Podaj kod zespołu</label>
                    <input
                        className='text-black'
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        required
                    />
                </div>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Szukaj zespołu</button>
            </form>
            {teamResponse && <h3 className='text-2xl mb-5'>Nazwa zepsołu: {teamResponse.name}</h3>}
            {teamResponse && <h3 className='text-2xl mb-5'>Lider zespołu: {teamResponse.teamLeaderName}</h3>}
            {teamResponse && <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit" onClick={joinTeam}>Dołącz do tego zespołu</button>}
            {message && <h3 className='text-2xl mb-5'>{message.message}</h3>}
            <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit" onClick={returnToDashboard}>Wróć na stronę główną</button>
        </div>
        </>
    );
  
};

export default AddScoutToTeam;