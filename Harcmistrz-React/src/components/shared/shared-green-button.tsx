import { ReactNode } from 'react';

interface GreenButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export const GreenButton = (props: GreenButtonProps ) => {
    return (
        <button className="bg-p_green text-lg p-2 mt-1 rounded text-white hover:text-a_yellow" onClick={props.onClick}>
            {props.children}
        </button>
    );
}