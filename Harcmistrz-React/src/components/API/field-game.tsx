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