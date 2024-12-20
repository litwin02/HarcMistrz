import { ReactNode } from 'react';

export const FormDiv = ({ children }: { children: ReactNode }) => {
    return (
        <div className="mb-4">
            {children}
        </div>
    );
}