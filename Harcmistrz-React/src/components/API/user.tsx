import { MessageResponse } from "../Models/MessageResponse";
import { Roles } from "../Models/Roles";

export interface UserInformation {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export const GetUserInformation = async (API_BASE_URL: string, userId: string) : Promise<UserInformation> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać informacji o użytkowniku");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export interface EditUserInformation {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export const EditUserInformation = async (API_BASE_URL: string, userId: string, userInfo: EditUserInformation) : Promise<MessageResponse>=> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userInfo)
        });
        if (!response.ok) {
            throw new Error("Nie udało się zaktualizować informacji o użytkowniku");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export interface ChangePasswordRequest {
    email: string;
    oldPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    id?: number;
    role?: Roles;
    token?: string;
}

export const ChangePassword = async (API_BASE_URL: string, changePasswordRequest: ChangePasswordRequest) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(changePasswordRequest)
        });
        return response;
    }
    catch (e: any) {
        throw e;
    }
}

export const DeleteUser = async (API_BASE_URL: string, userId: string) : Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się usunąć użytkownika");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}