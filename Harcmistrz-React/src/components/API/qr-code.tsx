import dayjs from "dayjs";

export interface QR_Scan {
    id: number;
    scoutId: number;
    firstName: string;
    lastName: string;
    email: string;
    qrCodeId: number;
    scanTime: string;
    points: number;
}

export const CheckWhoScannedCode = async (API_BASE_URL: string, qrCodeId: number): Promise<QR_Scan> => {
    try {
        const response = await fetch(`${API_BASE_URL}/qr_scan/checkWhoScannedQRCode/${qrCodeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error("Nie udało się sprawdzić kto zeskanował kod QR");
        }
        const fetchData = await response.json();
        fetchData.scanTime = dayjs(fetchData.scanTime).format('DD-MM-YYYY HH:mm');
        return fetchData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

