import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/indices';

const initialState: INITIALSTATE = {
    indices: null,
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;
    switch(type){
        case TYPES.INDICES_FIND:
            return{
                ...state,
                indices: payload
            };
        case TYPES.INDICES_CREATE:
            return{
                ...state,
                indices: state.indices ? [payload, ...state.indices] : [payload]
            };
        case TYPES.INDICES_UPDATE:
            return{
                ...state,
                indices: state.indices ? state.indices.map(el => el._id === payload._id ? payload : el) : [payload],
            };
        case TYPES.INDICES_DELETE:
            return{
                ...state,
                indices: state.indices ? state.indices.filter(el => el._id !== payload) : null,
            };
        default: 
            return state;
    }
}

export default Reducer;