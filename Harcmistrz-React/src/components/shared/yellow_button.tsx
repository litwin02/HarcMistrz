import { ReactNode } from 'react';

interface YellowButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export const YellowButton = (props: YellowButtonProps ) => {
    return (
        <button className="bg-a_yellow text-lg p-2 mt-1 rounded text-black hover:text-s_brown" onClick={props.onClick}>
            {props.children}
        </button>
    );
}