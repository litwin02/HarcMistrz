import { ReactNode } from 'react';

export const MainBox = ({ children }: { children: ReactNode }) => {
    return (
        <main className="bg-a_yellow">
            <div className="container mx-auto py-10">
                {children}
            </div>
        </main>
    );
}