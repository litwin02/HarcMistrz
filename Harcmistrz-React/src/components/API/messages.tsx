import { Roles } from "../Models/Roles";

export interface Message {
    id: number;
    senderId: number;
    recipientId: number;
    message: string;
    timestamp: string;
}

export interface NewMessage {
    recipientId: number;
    message: string;
}

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: Roles;
}

export const getAllMessages = async (API_BASE_URL: string): Promise<Message[]> => {
    try{
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(!response.ok){
            throw new Error("Nie udało się pobrać wiadomości");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch(error){
        console.error(error);
        throw error;
    }
};

export const getConversation = async (API_BASE_URL: string, recipientId: number): Promise<Message[]> => {
    try{
        const response = await fetch(`${API_BASE_URL}/messages/${recipientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(!response.ok){
            throw new Error("Nie udało się pobrać wiadomości");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

export const sendMessage = async (API_BASE_URL: string, newMessage: NewMessage): Promise<Message> => {
    try{
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newMessage)
        });
        if(!response.ok){
            throw new Error("Nie udało się wysłać wiadomości");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

export const getUsersToChatWith = async (API_BASE_URL: string): Promise<UserDTO[]> => {
    try{
        const response = await fetch(`${API_BASE_URL}/messages/getUsersToChatWith`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(!response.ok){
            throw new Error("Nie udało się pobrać użytkowników");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}