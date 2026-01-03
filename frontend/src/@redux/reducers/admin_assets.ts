import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/admin_assets';

const initialState: INITIALSTATE = {
    names: null,
    asset: null,
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.ADMIN_ASSETS_FIND_SELECT:
            return{
                ...state,
                names: payload
            };
        case TYPES.ADMIN_ASSETS_CREATE:
            return{
                ...state,
                names: state.names ? [payload, ...state.names] : [payload]
            };
        case TYPES.ADMIN_ASSETS_FIND_ID:
            return{
                ...state,
                asset: payload,
            };
        case TYPES.ADMIN_ASSETS_UPDATE:
            return{
                ...state,
                asset: payload,
            };
        case TYPES.ADMIN_ASSETS_DELETE:
            return {
                ...state,
                names: state.names ? state.names.filter(el => el._id !== payload) : null,
                asset: null
            }
        default: 
            return state;
    }
}

export default Reducer;