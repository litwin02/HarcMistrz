import { ReactNode } from 'react';

interface SharedH2Props {
    sx?: string;
    children: ReactNode;
}

export const SharedH2 = (props: SharedH2Props) => {
    if (props.sx === "text-center") {
        return (
            <h2 className="text-2xl mb-2 text-center">{props.children}</h2>
        );
    }
    return (
        <h2 className="text-2xl mb-2">{props.children}</h2>
    );
}