export interface QR_CodeDTO {
    id: number;
    fieldGameId: number;
    qrCode: string;
    points: number;
    scanned: boolean;
    description: string;
}