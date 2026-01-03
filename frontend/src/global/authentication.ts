import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { user_authentication } from '@localstorage';
import Authentication from '@redux/actions/authentications';

const Auth = () => {

    const dispatch = useAppDispatch();

    const {user} = useAppSelector(state => state.authentications);

    useEffect(() => {
        let user_storage = user_authentication.get(); 
        if(user || !user_storage) return;
        const isTokenExpired = Date.now() >= user_storage.expires;
        if(isTokenExpired) return user_authentication.remove();
        dispatch(Authentication.load());
    }, [user, dispatch]);

    return null;
}

export default Auth