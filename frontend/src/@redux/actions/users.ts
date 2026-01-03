import { Dispatch } from 'redux';
import { ACTIONS, TYPES, IUsersApi, IUsersVerifyEmail } from '@redux/types/users';
import { api } from '@redux/api';

const endpoint = "/users"

const update = (data: IUsersApi) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}`, data);
        dispatch({
            type: TYPES.USERS_UPDATE,
            payload: res.data.data as IUsersApi
        });
    } catch(error:any){
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {update: error.response.data.message}
        });
        console.log(error.response);
    }
};

const password = (password: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.patch(`${endpoint}/password`, {password});
        dispatch({
            type: TYPES.USERS_RESPONSE_STATUS,
            payload: {password: "Password has been successfully changed."}
        });
        setTimeout(() => {
            dispatch({
                type: TYPES.USERS_RESPONSE_STATUS,
                payload: {}
            });
        }, 5000);
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {}
        });
    } catch(error:any){
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {password: error.response.data.message}
        });
        console.log(error.response.data);
    }
};

const verifyToken = (email: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.patch(`${endpoint}/verify/token`, {email});
        dispatch({
            type: TYPES.USERS_RESPONSE_STATUS,
            payload: { verify_email_token: "success", email}
        });
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {}
        });
    } catch(error:any){
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {verify_email_token: error.response.data.message}
        });
        console.log(error.response.data);
    }
};

const verifyEmail = (data: IUsersVerifyEmail) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}/verify/email`, data);
        dispatch({
            type: TYPES.USERS_UPDATE,
            payload: res.data.data
        });
        dispatch({
            type: TYPES.USERS_RESPONSE_STATUS,
            payload: {verify_email: "success"}
        });
    } catch(error:any){
        dispatch({
            type: TYPES.USERS_RESPONSE_ERROR,
            payload: {verify_email: error.response.data.message}
        });
        console.log(error.response.data);
    }
};

const stateErrors = (key:string, value: string) => async (dispatch: Dispatch<ACTIONS>) => {
    dispatch({
        type: TYPES.USERS_RESPONSE_ERROR,
        payload: {[key]: value}
    });
};

const stateClear = () => (dispatch: Dispatch<ACTIONS>) => {
    dispatch({
        type: TYPES.USERS_RESPONSE_CLEAR,
        payload: null
    });
};

const Actions = {
    update,
    password,
    verifyToken,
    verifyEmail,
    stateErrors,
    stateClear
};

export default Actions;