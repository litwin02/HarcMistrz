import { SharedH2 } from "../shared/shared-h2";
import { SharedP } from "../shared/shared-p";

export default function Footer(){
    return (
        <>
            <footer className="bg-s_brown text-white text-left w-full px-4 py-8 md:px-8 md:py-12">
                <SharedH2>Aplikacja HarcMistrz</SharedH2>
                <SharedP>Aplikacja HarcMistrz to narzędzie wspomagające zarządzanie drużyną harcerską.</SharedP>
                <SharedP>W razie problemów z aplikacją prosimy o kontakt z administratorem.</SharedP>
                <SharedP>© 2024 Jakub Litwin</SharedP>
            </footer>
        </>
    );
}