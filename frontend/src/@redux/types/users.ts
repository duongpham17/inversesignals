export interface IUsersApi {
    _id: string,
    username: string,
    email: string,
    credit: number,
    role: "user" | "admin",
    code: string,
    createdAt: number,
};

export interface IUsersVerifyEmail {
    email: string,
    token: string
};

export interface ResponseType {
    [key: string]: any
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    user: IUsersApi | null,
    status: ResponseType,
    errors: ResponseType,
};

export type TUsersObjectKeys = keyof INITIALSTATE

/*ACTION**************************************************************************************************************/

export enum TYPES {
    USERS_UPDATE = "USERS_UPDATE",
    USERS_RESPONSE_STATUS = "USERS_RESPONSE_STATUS",
    USERS_RESPONSE_ERROR  = "USERS_RESPONSE_ERROR",
    USERS_RESPONSE_CLEAR  = "USERS_RESPONSE_CLEAR"
};

interface Update {
    type: TYPES.USERS_UPDATE,
    payload: IUsersApi
};

interface Response_Status {
    type: TYPES.USERS_RESPONSE_STATUS,
    payload: ResponseType;
};

interface Response_Error {
    type: TYPES.USERS_RESPONSE_ERROR,
    payload: ResponseType;
};

interface Response_Clear {
    type: TYPES.USERS_RESPONSE_CLEAR,
    payload: null;
};

export type ACTIONS = Update | Response_Status | Response_Error | Response_Clear;