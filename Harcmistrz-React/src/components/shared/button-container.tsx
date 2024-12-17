import { ReactNode } from 'react';

export const ButtonContainer = ({ children }: { children: ReactNode }) => {
    return (
        <div className='grid grid-flow-col auto-cols-auto gap-2'>
            {children}
        </div>
    );
}