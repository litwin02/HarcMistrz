import { ReactNode } from 'react';

export const WhiteBox = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-1/2 bg-white p-5 rounded-lg mt-5">
            {children}
        </div>
    );
}