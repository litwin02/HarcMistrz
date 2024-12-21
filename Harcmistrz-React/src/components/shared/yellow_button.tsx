import { ReactNode } from 'react';

interface YellowButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type? : "button" | "submit" | "reset";
}

export const YellowButton = (props: YellowButtonProps ) => {
    return (
        <button className="bg-a_yellow text-lg p-2 mt-1 rounded text-black hover:text-s_brown" type={props.type} onClick={props.onClick}>
            {props.children}
        </button>
    );
}