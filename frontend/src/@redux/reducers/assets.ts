import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/assets';

const initialState: INITIALSTATE = {
    assets: null,
    asset: null,
    names: null,
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.ASSETS_FIND:
            return{
                ...state,
                assets: payload
            };
        case TYPES.ASSETS_FIND_ID:
            return{
                ...state,
                asset: payload
            };
        case TYPES.ASSETS_FIND_SELECT:
            return{
                ...state,
                names: payload
            };
        default: 
            return state;
    }
}

export default Reducer;