import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
    const navigate = useNavigate();

    const performLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        performLogout();
    }, []);

    return (
        <>
        </>
    );
};


export default Logout;