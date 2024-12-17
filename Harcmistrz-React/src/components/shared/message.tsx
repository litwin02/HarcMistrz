import { ReactNode } from 'react';

export const Message = ({ children }: { children: ReactNode }) => {
    return (
        <div className='mt-3'>
            <p className='text-lg'>{children}</p>
        </div>
    );
}