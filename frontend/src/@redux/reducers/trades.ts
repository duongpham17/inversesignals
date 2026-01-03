import { ACTIONS, TYPES, INITIALSTATE} from '@redux/types/trades';

const initialState: INITIALSTATE = {
    trades: null,
    open: null,
};

export const Reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;
    switch(type){
        case TYPES.TRADES_FIND:
            return{
                ...state,
                trades: payload
            };
        case TYPES.TRADES_UPDATE:
            return{
                ...state,
                trades: state.trades ? state.trades.map(el => el._id === payload._id ? payload : el) : [payload],
            };
        case TYPES.TRADES_DELETE:
            return{
                ...state,
                trades: state.trades ? state.trades.filter(el => el._id !== payload) : null,
                open: state.open ? state.open.filter(el => el._id !== payload) : null,
            };
        case TYPES.TRADES_CREATE:
            return{
                ...state,
                open: state.open ? [payload, ...state.open] : [payload],
            };
        case TYPES.TRADES_OPEN:
            return{
                ...state,
                open: payload
            };
        case TYPES.TRADES_CLOSE:
            return{
                ...state,
                open: state.trades ? state.trades.filter(el => el._id !== payload._id) : null,
            }
        default: 
            return state;
    }
}

export default Reducer;