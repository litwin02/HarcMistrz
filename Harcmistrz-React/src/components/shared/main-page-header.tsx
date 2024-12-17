import { ReactNode } from 'react';

export const MainPageHeader = ({ children }: { children: ReactNode }) => {
    return (
        <h1 className='text-4xl font-bold text-center'>{children}</h1>
    );
}