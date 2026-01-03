import { useNavigate } from 'react-router-dom';
import { user_authentication } from '@localstorage';

const Logout = () => {

    const navigate = useNavigate();

    const logout = () => {
        user_authentication.remove();
        navigate("/");
        window.location.reload();
    };
    
    return (
        <>
            <button onClick={logout}>Logout</button>
        </>
    )
}

export default Logout