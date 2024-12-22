import { ReactNode } from 'react';

export const WhiteBox = ({ children }: { children: ReactNode }) => {
    return (
        <div className="lg:w-1/2 md:w-full sm:w-screen bg-white p-5 rounded-lg mt-5">
            {children}
        </div>
    );
}