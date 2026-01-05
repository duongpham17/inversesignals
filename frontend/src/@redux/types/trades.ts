export interface ITrades {
    _id: string
    user_id: string,
    ticker: string,
    timeseries: string,
    leverage: number,
    size: number,
    fees: number,
    close_klines: number[],
    open_klines: number[],
    side: string,
    x_streaks: number,
    x_pchigh: number,
    x_composite_volatility: number,
    x_escalation: number,
    x_vwap: number,
    x_avg_volume: number,
    x_limits: number,
    x_rsi: number,
    createdAt: number;
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    trades: ITrades[] | null,
    open: ITrades[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    TRADES_FIND   = "TRADES_FIND",
    TRADES_CREATE = "TRADES_CREATE",
    TRADES_UPDATE = "TRADES_UPDATE",
    TRADES_DELETE = "TRADES_DELETE",
    TRADES_OPEN   = "TRADES_OPEN",
    TRADES_CLOSE  = "TRADES_CLOSE"
};

interface Find {
    type: TYPES.TRADES_FIND,
    payload: ITrades[]
};

interface Update {
    type: TYPES.TRADES_UPDATE,
    payload: ITrades
};

interface Create {
    type: TYPES.TRADES_CREATE,
    payload: ITrades
};

interface Remove {
    type: TYPES.TRADES_DELETE,
    payload: string
};

interface Open {
    type: TYPES.TRADES_OPEN,
    payload: ITrades[]
};

interface Close {
    type: TYPES.TRADES_CLOSE,
    payload: ITrades
}

export type ACTIONS = Find | Create | Update | Remove | Open | Close