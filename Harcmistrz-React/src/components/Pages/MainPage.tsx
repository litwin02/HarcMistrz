import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage(){

    const userToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    useEffect(() => {
        if(userToken != null && role === 'TEAM_LEADER') {
            navigate('/dashboard');
        }
        else if(userToken != null && role === 'USER') {
            navigate('/user-dashboard');
        }
        else if(userToken != null && role === 'ADMIN') {
            navigate('/admin');
        }
    }, []);

    return(
    <>
        <main>
            <div className="bg-p_green pt-20 lg:px-20 text-white">
                <div className="flex-col grid justify-center items-center text-center">
                    <h1 className="text-5xl mb-10 max-w-2xl">Ciesz się każdym spotkaniem ze swoją grupą.</h1>
                    <h2 className="text-3xl mb-10">Resztę obowiązków zostaw nam.</h2>
                </div>
                <div className="pt-10 pb-20 flex flex-rom flex-wrap justify-center">
                    <button className="bg-a_yellow mr-10 p-3 rounded-lg hover:text-s_brown text-2xl"><a href="/register">Zarejestruj się</a></button>
                    <button className="bg-s_brown p-3 rounded-lg hover:text-a_yellow text-2xl"><a href="/login">Zaloguj się</a></button>
                </div>
            </div>
        </main>
    </>
    );
}