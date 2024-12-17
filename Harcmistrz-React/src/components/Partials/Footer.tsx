import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";

export default function Header(){
    return(
        <>
            <footer className="bg-s_brown text-white text-left pt-10 p-5 lg:px-20 min-h-96">
                <SharedH2>Aplikacja HarcMistrz</SharedH2>
                <SharedP>Aplikacja HarcMistrz to narzędzie wspomagające zarządzanie drużyną harcerską.</SharedP>
                <SharedP>W razie problemów z aplikacją prosimy o kontakt z administratorem.</SharedP>
                <SharedP>© 2024 Jakub Litwin</SharedP>
            </footer>
        </>
    );
}