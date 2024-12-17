import { ReactNode } from 'react';

export const SharedP = ({ children }: { children: ReactNode }) => {
    return (
        <p className='text-lg'>{children}</p>
    );
}