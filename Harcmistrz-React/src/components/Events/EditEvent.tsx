import { useNavigate } from 'react-router-dom';
import { useApi } from '../../ApiContext';
import { useParams } from 'react-router-dom';
import { Event } from '../Models/EventModel';
import { useQuery } from 'react-query';
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from 'react';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pl';

import dayjs, { Dayjs } from 'dayjs';
import { MessageResponse } from '../Models/MessageResponse';
import 'dayjs/locale/pl';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { MainBox } from '../shared/main-box';
import { WhiteBoxColumn } from '../shared/white-box-column';
import { WhiteBox } from '../shared/white-box';
import { MainPageHeader } from '../shared/main-page-header';
import { BoldText } from '../shared/bold-text';
import { FormDiv } from '../shared/form-div';
import { FormLabel } from '../shared/form-label';
import { GreenButton } from '../shared/shared-green-button';
import { ReturnButton } from '../shared/shared-return-button';
import { ButtonContainer } from '../shared/button-container';

const EditEvent = () => {
    const API_BASE_URL = useApi();
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const { id } = useParams<{ id: string }>();

    const [message, setMessage] = useState<MessageResponse>();
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescrpition] = useState<string>('');
    const [date, setDate] = useState<Dayjs | null>(dayjs().tz("Europe/Warsaw"));
    const [strDate, setStrDate] = useState<string>(dayjs().tz("Europe/Warsaw").format());
    const [location, setLocation] = useState<string>('');

    const getEvent = async (id: string): Promise<Event> => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/getEventById/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Nie udało się pobrać wydarzenia");
            }
            const responseJson = await response.json();
            const eventDate = dayjs(responseJson.date);
            setName(responseJson.name);
            setDescrpition(responseJson.description);
            setLocation(responseJson.location);
            setDate(eventDate);

            return { ...responseJson, date: eventDate };
        } catch (e: any) {
            throw e;
        }
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate) {
            setDate(newDate);
            setStrDate(newDate.tz("Europe/Warsaw").format());
        } else {
            setStrDate('');
        }
    };


    const editEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/events/updateEvent`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    description: description,
                    date: strDate,
                    location: location
                })
            });
            if (!response.ok) {
                throw new Error("Nie udało się edytować wydarzenia");
            }
            setMessage(await response.json());
        }
        catch (e: any) {
            setError(e.message);
        }
    };

    const { data: eventData } = useQuery<Event, Error>(
        ['event', id],
        () => getEvent(id!),
        { enabled: !!id }
    );

    return (
        <MainBox>
            <WhiteBoxColumn>
                <MainPageHeader>Edytuj wydarzenie: <BoldText>{eventData!.name}</BoldText></MainPageHeader>
                <WhiteBox>
                    <form onSubmit={editEvent}>
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
                            <FormLabel>Opis wydarzenia</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="text"
                                value={description}
                                onChange={(e) => setDescrpition(e.target.value)}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Lokalizacja</FormLabel>
                            <input
                                className='mt-1 p-2 rounded-md w-full border'
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </FormDiv>
                        <FormDiv>
                            <FormLabel>Data</FormLabel>
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
                            <GreenButton type="submit">Edytuj wydarzenie</GreenButton>
                        </ButtonContainer>
                    </form>
                </WhiteBox>
                <ReturnButton to={`/event/${id}`}>Powrót do wydarzenia</ReturnButton>
            </WhiteBoxColumn>
        </MainBox>
    );
};

export default EditEvent;