import { MessageResponse } from "../Models/MessageResponse";

export interface EventParticipation {
    id: number;
    scoutInTeamId: number;
    eventId: number;
}

export const getEventParticipationsByScoutId = async (API_BASE_URL: string, scoutId: number): Promise<EventParticipation[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/event-participation/getEventParticipationByScoutId/${scoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać uczestnictwa w wydarzeniu.");
        }
        const fetchData = await response.json();
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postEventParticipation = async (API_BASE_URL: string, eventId: number, scoutId: number): Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/event-participation/addNewEventParticipation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                eventId,
                scoutId
            })
        });
        if (!response.ok) {
            throw new Error("Nie udało się zapisać na wydarzenie.");
        }
        const fetchData = await response.json();
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}