

export default function Header(){
    const token = localStorage.getItem('token');
    return(
        <>
            <header className="bg-s_brown text-white">
                <nav className="flex items-center justify-between p-5 lg:px-20" aria-label="Global">
                    <a href="/">
                        <img src="public\Logo.png" alt="Logo Harcmistrz" className="size-16"/>
                    </a>
                    
                    <ul className="flex items-center justify-between text-xl">
                        {token && <li className="hover:text-a_yellow"><a href="/logout" className="">Wyloguj się</a></li>}
                    </ul>
                </nav>
            </header>
        </>
    );
}