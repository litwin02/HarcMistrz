export default function Header(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    return(
        <>
            <header className="bg-s_brown text-white">
                <nav className="flex items-center justify-between p-5 lg:px-20" aria-label="Global">
                    <div className="flex items-center justify-between">
                        <a href={role === 'TEAM_LEADER' ? "/dashboard" : role === 'SCOUT' ? "/user-dashboard" : "/"}>
                            <img src="/Logo.png" alt="Logo Harcmistrz" className="size-16"/>
                            
                        </a>
                        <h1 className="text-2xl ml-3">HarcMistrz</h1>
                    </div>
                    
                    <ul className="flex items-center justify-between text-xl">
                        {token && <li className="hover:text-a_yellow mr-5"><a href="/user-profile">Profil</a></li>}
                        {token && <li className="hover:text-a_yellow"><a href="/logout" className="">Wyloguj się</a></li>}
                        {token && <li className="hover:text-a_yellow"><a href="/messages" className="">Chat</a></li>}
                    </ul>
                    
                </nav>
            </header>
        </>
    );
}