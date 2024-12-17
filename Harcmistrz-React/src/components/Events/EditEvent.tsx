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

const EditEvent = () => {
    const navigate = useNavigate();
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

        try{
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
        catch(e: any){
            setError(e.message);
        }
    };

    const { data: eventData} = useQuery<Event, Error>(
        ['event', id],
        () => getEvent(id!),
        { enabled: !!id }
    );

    return (
        <>
            <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
            <h2 className='text-3xl mb-5'>Edytuj wydarzenie {eventData?.name}</h2>
            <form onSubmit={editEvent}>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Nazwa wydarzenia</label>
                    <input
                        className='text-black'
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Opis wydarzenia</label>
                    <input
                        className='text-black'
                        type="text"
                        value={description}
                        onChange={(e) => setDescrpition(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Miejsce wydarzenia</label>
                    <input
                        className='text-black'
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className='text-2xl mb-5'>
                    <label className='mr-5'>Data wydarzenia</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                        <DateTimePicker
                            label="Wybierz datę"
                            value={date}
                            onChange={(handleDateChange)}
                        />
                    </LocalizationProvider>
                </div>
                {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
                {message && <p className='mb-8 text-green-800 text-2xl'>{message.message}</p>}
                <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Edytuj wydarzenie</button>
                
            </form>
            <button className="bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown" type="submit" 
            onClick={() => navigate(`/event/${id}`)}>Wróć do panelu głównego</button>
        </div>
        </>
    );
};

export default EditEvent;