import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/users';

const initialState: INITIALSTATE = {
    user: null,
    status: {},
    errors: {},
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.USERS_UPDATE:
            return{
                ...state,
                user: payload
            };
        case TYPES.USERS_RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            };
        case TYPES.USERS_RESPONSE_ERROR:
            return{
                ...state,
                errors: payload
            };
        case TYPES.USERS_RESPONSE_CLEAR:
            return {
                ...state,
                errors: {},
                status: {}
            }
        default: 
            return state;
    }
}

export default Reducer;