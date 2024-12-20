import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { MessageResponse } from "../Models/MessageResponse";
import { useApi } from "../../ApiContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pl';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { MainBox } from "../shared/main-box";
import { WhiteBox } from "../shared/white-box";
import { WhiteBoxColumn } from "../shared/white-box-column";
import { MainPageHeader } from "../shared/main-page-header";
import { FormDiv } from "../shared/form-div";
import { FormLabel } from "../shared/form-label";
import { GreenButton } from "../shared/shared-green-button";
import { ButtonContainer } from "../shared/button-container";
import { ReturnButton } from "../shared/shared-return-button";


const NewEvent = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Europe/Warsaw");

    const teamLeaderId = Number(localStorage.getItem('id'));
    const userToken = localStorage.getItem('token');
    const API_BASE_URL = useApi();
    const navigate = useNavigate();
    useEffect(() => {
        getTeam();
    }, []);

    const returnToDashboard = () => {
        navigate("/dashboard");
    };

    const [error, setError] = useState<string | null>(null);
    const [team, setTeam] = useState<BasicTeamResponse>();
    
    const getTeam = async () => {
        setError(null);

        try{
            const response = await fetch(`${API_BASE_URL}/teams/getTeamByTeamLeaderId/${teamLeaderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
            });
            if(!response.ok){
                navigate("/dashboard");
            }
            setTeam(await response.json());
        }
        catch(e: any){
            throw e;
        }

    }
    
    const [message, setMessage] = useState<MessageResponse>();

    const createNewEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const teamId = team?.id;
        
        try{
            const response = await fetch(`${API_BASE_URL}/events/createNewEvent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}` 
                },
                body: JSON.stringify({ 
                    name: name,
                    description: description,
                    date: strDate, 
                    location: location,
                    teamId: teamId
                })
            });
            if(!response.ok){
                throw new Error("Nie udało się stworzyć nowego wydarzenia!");
            }
            setMessage(await response.json());
            setName('');
            setDescrpition('');
            setDate(dayjs().tz("Europe/Warsaw"));
            setStrDate('');
            setLocation('');
        }
        catch(e: any){
            setError(e.message);
        }
    }

    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');
    const [date, setDate] = useState<Dayjs | null>(dayjs().tz("Europe/Warsaw"));
    const [strDate, setStrDate] = useState<string>(dayjs().tz("Europe/Warsaw").format());
    const [location, setLocation] = useState<string>('');

    const handleDateChange = (newDate: Dayjs | null) => {
        if(newDate){
            setDate(newDate);
            setStrDate(newDate.tz("Europe/Warsaw").format());
        }
        else{
            setStrDate('');
        }
    }


    return(
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Utwórz nowe wydarzenie</MainPageHeader>
            <WhiteBox>
            <form onSubmit={createNewEvent}>
                <FormDiv>
                    <FormLabel>Nazwa wydarzenia</FormLabel>
                    <input
                        className="mt-1 p-2 rounded-md w-full border"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Opis</FormLabel>
                    <input
                        className="mt-1 p-2 rounded-md w-full border"
                        type="text"
                        value={description}
                        onChange={(e) => setDescrpition(e.target.value)}
                        required
                    />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Lokalizacja</FormLabel>
                    <input
                        className="mt-1 p-2 rounded-md w-full border"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </FormDiv>
                <FormDiv>
                    <FormLabel>Data wydarzenia</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                        <DateTimePicker
                            label="Wybierz datę"
                            value={date}
                            onChange={(handleDateChange)}
                            sx={{ marginTop: '10px', padding: '0', width: '100%' }}
                        />
                    </LocalizationProvider>
                </FormDiv>
                {error && <p className='mb-4 text-red-800 text-2xl'>{error}</p>}
                {message && <p className='mb-4 text-green-800 text-2xl'>{message.message}</p>}
                <ButtonContainer>
                    <GreenButton type="submit">Stwórz nowe wydarzenie</GreenButton>
                </ButtonContainer>
            </form>
            </WhiteBox>
            <ReturnButton to="/dashboard">Wróć do panelu głównego</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
}

export default NewEvent;