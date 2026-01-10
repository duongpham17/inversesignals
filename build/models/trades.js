"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
;
;
const TradesSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    x_candle_roi: {
        type: Number
    },
    createdAt: {
        type: Number,
        default: () => Date.now(),
    },
}, { versionKey: false });
const Trades = mongoose_1.default.models.Trades || (0, mongoose_1.model)("Trades", TradesSchema);
exports.default = Trades;
