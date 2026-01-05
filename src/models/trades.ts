import mongoose, { Schema, model, Types, Document, Model } from "mongoose";

export interface ITrades {
    _id: string | Types.ObjectId;
    user_id: string | Types.ObjectId,
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
    x_rsi: number,
    x_avg_volume: number,
    x_limits: number,
    createdAt: number;
};

export interface ITradesDocument extends Document, ITrades {
  _id: Types.ObjectId;
};

const TradesSchema = new Schema<ITradesDocument>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    ticker: {
        type: String
    },
    timeseries: {
        type: String
    },
    side: {
        type: String
    },
    leverage: {
        type: Number
    },
    size: {
        type: Number
    },
    fees: {
        type: Number,
    },
    open_klines: {
        type: [Number],
    },
    close_klines: {
        type: [Number],
    },
    x_avg_volume: {
        type: Number,
    }, 
    x_limits: {
        type: Number
    },
    x_streaks: {
        type: Number
    },
    x_pchigh: {
        type: Number,
    },
    x_composite_volatility: {
        type: Number,
    },
    x_escalation: {
        type: Number,
    },
    x_vwap: {
        type: Number,
    },
    x_rsi: {
        type: Number
    },
    createdAt: {
        type: Number,
        default: () => Date.now(),
    },
}, { versionKey: false });

const Trades: Model<ITradesDocument> = mongoose.models.Trades || model<ITradesDocument>("Trades", TradesSchema);
export default Trades;