import { ReactNode } from 'react';

export const BoldText = ({ children }: { children: ReactNode }) => {
    return (
        <span className='font-bold'>{children}</span>
    );
}