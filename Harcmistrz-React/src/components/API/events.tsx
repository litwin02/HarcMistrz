import { Event } from '../Models/EventModel';
import dayjs from 'dayjs';

export const getEventById = async (API_BASE_URL: string, eventId: number): Promise<Event> => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/getEventById/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać wydarzeń");
        }
        const fetchData = await response.json();
        fetchData.date = dayjs(fetchData.date);
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getEventsByTeamId = async (API_BASE_URL: string, teamId: number): Promise<Event[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/events/getAllEventsByTeamId/${teamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać wydarzeń");
        }
        const fetchData = await response.json();
        for(let i = 0; i < fetchData.length; i++) {
            fetchData[i].date = dayjs(fetchData[i].date);
        }
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}