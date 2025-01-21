import { BasicTeamResponse } from "../Models/BasicTeamResponse";
import { MessageResponse } from "../Models/MessageResponse";

export interface TeamMember {
    scoutId: number;
    firstName: string;
    lastName: string;
    email: string;
}

export const GetTeamByScoutId = async (API_BASE_URL: string, scoutId: number): Promise<BasicTeamResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/getTeamByScoutId/${scoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie znaleziono żadnej drużyny!");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const getTeamMembers = async (API_BASE_URL: string , teamId: number) : Promise<TeamMember[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/getTeamMembers/${teamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać członków zespołu");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const deleteTeamMember = async (API_BASE_URL: string, teamId: number, scoutId: number): Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/remove/${scoutId}/from/${teamId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się usunąć członka zespołu");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const getTeamByTeamLeaderId = async (API_BASE_URL: string, teamLeaderId: number): Promise<BasicTeamResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/getTeamByTeamLeaderId/${teamLeaderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie znaleziono żadnej drużyny!");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
};

export const editTeam = async (API_BASE_URL: string, teamId: number, newName: string): Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/updateTeamName/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: (newName)
        });
        if (!response.ok) {
            throw new Error("Nie udało się zmienić nazwy drużyny");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const deleteTeam = async (API_BASE_URL: string, teamId: number): Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/deleteTeam/${teamId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się usunąć drużyny");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const GetAllTeams = async (API_BASE_URL: string): Promise<BasicTeamResponse[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/getAllTeams`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać drużyn");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}

export const GetTeamById = async (API_BASE_URL: string, teamId: number): Promise<BasicTeamResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/teams/getTeamById/${teamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać drużyny");
        }
        return await response.json();
    }
    catch (e: any) {
        throw e;
    }
}