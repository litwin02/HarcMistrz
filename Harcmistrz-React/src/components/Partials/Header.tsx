import { useState } from "react";

export default function Header() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="bg-s_brown text-white">
                <nav className="flex items-center justify-between p-5 lg:px-20" aria-label="Global">
                    <div className="flex items-center justify-between">
                        <a href={role === 'TEAM_LEADER' ? "/dashboard" : role === 'SCOUT' ? "/user-dashboard" : "/"}>
                            <img src="/Logo.png" alt="Logo Harcmistrz" className="size-16" />

                        </a>
                        <h1 className="text-2xl ml-3 hidden lg:block">HarcMistrz</h1>
                    </div>
                    { token &&
                        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    }
                    <ul className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col absolute top-24 right-0 bg-a_yellow w-full p-4 lg:hidden`}>
                        {token && <li className="hover:text-a_yellow mb-3"><a href="/messages" className="">Chat</a></li>}
                        {token && <li className="hover:text-a_yellow mb-3"><a href="/user-profile">Profil</a></li>}
                        {token && <li className="hover:text-a_yellow"><a href="/logout" className="">Wyloguj się</a></li>}
                    </ul>

                    <ul className="items-center justify-between text-xl hidden lg:flex">
                        {token && <li className="hover:text-a_yellow mr-5"><a href="/messages" className="">Chat</a></li>}
                        {token && <li className="hover:text-a_yellow mr-5"><a href="/user-profile">Profil</a></li>}
                        {token && <li className="hover:text-a_yellow"><a href="/logout" className="">Wyloguj się</a></li>}

                    </ul>

                </nav>
            </header>
        </>
    );
}