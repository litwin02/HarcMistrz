import { useParams } from "react-router-dom";
import { useApi } from "../../ApiContext";
import { MainBox } from "../shared/main-box";
import { MainPageHeader } from "../shared/main-page-header";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { GetFieldGameResults, type FieldGameResult } from "../API/field-game";
import { useEffect, useState } from "react";
import { SharedP } from "../shared/shared-p";
import { ReturnButton } from "../shared/shared-return-button";


const FieldGameResult = () => {

    const API_BASE_URL = useApi();
    const { fieldGameId } = useParams<{ fieldGameId: string }>();
    const { eventId } = useParams<{ eventId: string }>();

    const [result, setResult] = useState<FieldGameResult[]>();
    useEffect(() => {
        const fetchResults = async () => {
            if (fieldGameId) {
                const response = await GetFieldGameResults(API_BASE_URL, parseInt(fieldGameId));
                setResult([...response].sort((a, b) => b.points - a.points));
            }
        };
        fetchResults();
    }, [API_BASE_URL, fieldGameId]);


    function filterResults(option: string) {
        if (!result) return;
        switch (option) {
            case "MIN":
                setResult([...result].sort((a, b) => a.points - b.points));
                break;
            case "MAX":
            default:
                setResult([...result].sort((a, b) => b.points - a.points));
                break;
        }
    }

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Wynik gry terenowej</MainPageHeader>
                <WhiteBox>
                    {!result ? (
                        <SharedP>Brak wyników.</SharedP>) : (
                        <>
                            <SharedP>Filtrowanie wyników:</SharedP>
                            <select className="p-2 border rounded" onChange={(e) => {
                                filterResults(e.target.value);
                            }}>
                                <option value="MAX">Najwyższa ilość zdobytych punktów</option>
                                <option value="MIN">Najmniejsza ilość zdobytych punktów</option>
                            </select>
                            <table className="table-auto w-full mt-4 text-left min-w-max">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th>Imię</th>
                                        <th>Nazwisko</th>
                                        <th>Email</th>
                                        <th>Punkty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.map((r, index) => (
                                        <tr key={index} className="border-b border-gray-500 mb-2">
                                            <td>{r.firstName}</td>
                                            <td>{r.lastName}</td>
                                            <td>{r.email}</td>
                                            <td>{r.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </WhiteBox>
                <ReturnButton to={`/event/${eventId}`}>Wróć do zarządzania wydarzeniem</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default FieldGameResult;