import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Partials/Header";
import { useApi } from "../../ApiContext";

const NewTeam = () => {
    const teamLeaderId = Number(localStorage.getItem('id'));
    const userRole = localStorage.getItem('role');
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();
    useEffect(() => {
        if(userRole !== 'TEAM_LEADER'){
            navigate('/dashboard');
        }
    }, []);
    

    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState<string>('');
    const [joinCode, setJoinCode] = useState<string | null>(null);

    const createNewTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try{
            const response = await fetch(`${API_BASE_URL}/teams/createNewTeam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
                body: JSON.stringify({ teamLeaderId, teamName })
            });

            if(!response.ok){
                throw new Error("Nie udało się stworzyć nowej drużyny!");
            }
            const responseData: string = await response.text();
            if(responseData.length < 5 || responseData == null){
                throw new Error("Nie udało się poprawnie stworzyć nowej drużyny!");
            }

            setJoinCode(responseData);
            
        }
        catch(e: any){
            setError(e.message);
        }
    };

    const returnToDashboard = () => {
        navigate("/dashboard");
    };

    return(<>
        <Header />
        <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Utwórz nowy zespół</h2>
            <form onSubmit={createNewTeam}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Nazwij swój zespół</label>
                    <input
                        className='text-black'
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>
                <h3 className="mb-5">Stworzymy unikalny kod dla Twojego zespołu. 
                    Inni członkowie zespołu będą go mogli podać, aby dołączyć do twojej drużyny</h3>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                {!joinCode && <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Stwórz nowy zespół</button> }
                {joinCode && <p className="mb-8 text-2xl">Twój kod zespołu: {joinCode}</p>}
            </form>
            {joinCode && <button className="bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown" type="submit" onClick={returnToDashboard}>Wróć do panelu głównego</button>}
        </div>
    </>)
};

export default NewTeam;