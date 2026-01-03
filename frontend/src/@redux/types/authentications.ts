/*TYPES**************************************************************************************************************/
import { IUsersApi } from './users';

export interface ResponseType {
    [key: string]: string
};

export interface IAuthenticationsSignup {
    username: string,
    password: string,
};

export interface IAuthenticationsSignin {
    username: string,
    password: string,
};

export interface IAuthenticationsForgot {
    email: string,
};

export interface IAuthenticationsReset {
    password: string,
    token: string,
};
/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    user: IUsersApi | null,
    status: ResponseType,
    errors: ResponseType,
};

export type TAuthenticationsObjectKeys = keyof INITIALSTATE

/*ACTION**************************************************************************************************************/

export enum TYPES {
    AUTHENTICATIONS_UPDATE           = "AUTHENTICATIONS_UPDATE",
    AUTHENTICATIONS_SIGNIN           = "AUTHENTICATIONS_SIGNIN",
    AUTHENTICATIONS_SIGNUP           = "AUTHENTICATIONS_SIGNUP",
    AUTHENTICATIONS_CODE             = "AUTHENTICATIONS_CODE",
    AUTHENTICATIONS_LOAD             = "AUTHENTICATIONS_LOAD",
    AUTHENTICATIONS_RESET            = "AUTHENTICATIONS_RESET",
    AUTHENTICATIONS_FORGOT           = "AUTHENTICATIONS_FORGOT",
    AUTHENTICATIONS_RESPONSE_ERROR   = "AUTHENTICATIONS_RESPONSE_ERROR",
    AUTHENTICATIONS_RESPONSE_STATUS  = "AUTHENTICATIONS_RESPONSE_STATUS",
    AUTHENTICATIONS_RESPONSE_CLEAR   = "AUTHENTICATIONS_RESPONSE_CLEAR",
};

interface Update {
    type: TYPES.AUTHENTICATIONS_UPDATE,
    payload: IUsersApi
};

interface Signin {
    type: TYPES.AUTHENTICATIONS_SIGNIN,
    payload: IUsersApi
};

interface Signup {
    type: TYPES.AUTHENTICATIONS_SIGNUP,
    payload: IUsersApi
};

interface Load {
    type: TYPES.AUTHENTICATIONS_LOAD,
    payload: IUsersApi
};

interface Reset {
    type: TYPES.AUTHENTICATIONS_RESET,
    payload: IUsersApi
};

interface Forgot {
    type: TYPES.AUTHENTICATIONS_FORGOT,
    payload: ResponseType
};

interface Response_Status {
    type: TYPES.AUTHENTICATIONS_RESPONSE_STATUS,
    payload: ResponseType;
};

interface Response_Error {
    type: TYPES.AUTHENTICATIONS_RESPONSE_ERROR,
    payload: ResponseType;
};

interface Response_Clear {
    type: TYPES.AUTHENTICATIONS_RESPONSE_CLEAR,
    payload: null
};

export type ACTIONS = Update | Signin | Signup | Forgot | Reset | Load | Response_Status | Response_Error | Response_Clear