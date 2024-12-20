import { ReactNode } from 'react';

export const FormLabel = ({ children }: { children: ReactNode }) => {
    return (
        <label className="block font-medium text-gray-700">
            {children}
        </label>
    );
}