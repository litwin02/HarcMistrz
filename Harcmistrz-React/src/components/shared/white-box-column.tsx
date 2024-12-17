import { ReactNode } from 'react';

export const WhiteBoxColumn = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col justify-center items-center mt-5">
            {children}
        </div>
    );
}