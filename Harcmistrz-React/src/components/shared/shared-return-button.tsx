import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; 

interface ReturnButtonProps {
    children: ReactNode;
    to: string;
}

export const ReturnButton = (props: ReturnButtonProps ) => {
    const navigate = useNavigate();
    return (
        <button className="bg-s_brown p-2 text-xl mt-4 rounded text-white hover:text-p_green w-1/2" onClick={() => navigate(props.to)}>
            {props.children}
        </button>
    );
}