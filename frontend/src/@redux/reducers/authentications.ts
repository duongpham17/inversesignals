import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/authentications';

const initialState: INITIALSTATE = {
    user: null,
    status: {},
    errors: {}
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.AUTHENTICATIONS_UPDATE:
            return{
                ...state,
                user: payload
            };
        case TYPES.AUTHENTICATIONS_SIGNIN:
            return{
                ...state,
                user: payload
            };
        case TYPES.AUTHENTICATIONS_SIGNUP:
            return{
                ...state,
                user: payload
            };
        case TYPES.AUTHENTICATIONS_LOAD:
            return{
                ...state,
                user: payload
            };
        case TYPES.AUTHENTICATIONS_RESET:
            return{
                ...state,
                user: payload
            };
        case TYPES.AUTHENTICATIONS_FORGOT:
            return{
                ...state,
                status: payload
            };
        case TYPES.AUTHENTICATIONS_RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            };
        case TYPES.AUTHENTICATIONS_RESPONSE_ERROR:
            return{
                ...state,
                errors: payload
            };
        case TYPES.AUTHENTICATIONS_RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {},
            }
        default: 
            return state;
    }
}

export default Reducer;