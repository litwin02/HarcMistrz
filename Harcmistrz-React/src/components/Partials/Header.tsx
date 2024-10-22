

export default function Header(){
    return(
        <>
            <header className="bg-s_brown text-white">
                <nav className="flex items-center justify-between p-5 lg:px-20" aria-label="Global">
                    <a href="/">
                        <img src="public/logo.png" alt="Logo Harcmistrz" className="size-16"/>
                    </a>
                    
                    <ul className="flex items-center justify-between text-xl">
                        <li className="mx-4 hover:text-a_yellow">O nas</li>
                        <li className="hover:text-a_yellow">Zaloguj się</li>
                    </ul>
                </nav>
            </header>
        </>
    );
}