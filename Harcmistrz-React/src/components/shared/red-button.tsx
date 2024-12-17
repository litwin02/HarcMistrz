import { ReactNode } from 'react';

interface RedButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export const RedButton = (props: RedButtonProps ) => {
    return (
        <button className="bg-red-700 text-lg p-2 mt-1 rounded text-white hover:text-a_yellow" onClick={props.onClick}>
            {props.children}
        </button>
    );
}