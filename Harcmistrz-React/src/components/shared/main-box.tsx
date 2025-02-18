import { ReactNode } from 'react';

export const MainBox = ({ children }: { children: ReactNode }) => {
    return (
        <main className="bg-p_green">
            <div className="container mx-auto lg:py-30 md:py-20 py-10">
                {children}
            </div>
        </main>
    );
}