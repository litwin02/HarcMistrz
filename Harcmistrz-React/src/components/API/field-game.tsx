import { MessageResponse } from "../Models/MessageResponse";

export interface QR_CodeString {
    qr_code_id: string;
    field_game_id: string;
    points: number;
}

export interface QRCodeScanRequest {
    qrCode: string;
    fieldGameId: number;
    scoutId: number;
}

export interface FieldGameResult {
    fieldGameId: number;
    scoutId: number;
    firstName: string;
    lastName: string;
    email: string;
    points: number;
}

export interface FieldGameScoutResult {
    fieldGameId: number;
    scoutId: number;
    points: number;
    codeScannedCount: number;
    hasScoutWon?: boolean;
    scoreboardPosition?: number;
}

export enum FieldGameStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

export interface FieldGame{
    id: number;
    name: string;
    description: string;
    status: FieldGameStatus;
    eventId: number;
}

export const ActivateFieldGame = async (API_BASE_URL: string, fieldGameId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/fieldGames/activateFieldGame/${fieldGameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const DeactivateFieldGame = async (API_BASE_URL: string, fieldGameId: number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/fieldGames/deactivateFieldGame/${fieldGameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const ScanQRCode = async (API_BASE_URL: string, qrCodeScanRequest: QRCodeScanRequest): Promise<MessageResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/qr_codes/scanQRCode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(qrCodeScanRequest)
        });
        if (!response.ok) {
            throw new Error("Nie udało się zeskanować kodu QR");
        }
        const fetchData = await response.json();
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const GetFieldGameResults = async (API_BASE_URL: string, fieldGameId: number): Promise<FieldGameResult[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/fieldGames/getFieldGameResults/${fieldGameId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać wyników gry terenowej");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const GetPointsForScout = async (API_BASE_URL: string, fieldGameId: number, scoutId: number): Promise<number> => {
    try {
        const response = await fetch(`${API_BASE_URL}/qr_scan/getPointsForScout/${fieldGameId}/${scoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać punktów dla harcerza");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

export const GetResultForScout = async (API_BASE_URL: string, fieldGameId: number, scoutId: number): Promise<FieldGameScoutResult> => {
    try {
        const response = await fetch(`${API_BASE_URL}/fieldGames/getFieldGameResultsForScout/${fieldGameId}/${scoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się pobrać wyniku dla harcerza");
        }
        const fetchData = await response.json();
        return fetchData;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}