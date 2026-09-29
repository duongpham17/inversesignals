"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalBars = exports.onCandle = exports.subscribeToBars = void 0;
const ws_1 = __importDefault(require("ws"));
const API_KEY = process.env.ALPACA_API_KEY;
const SECRET_KEY = process.env.ALPACA_SECRET_KEY;
if (!API_KEY || !SECRET_KEY) {
    throw new Error('Missing Alpaca API credentials');
}
const alpaca = new ws_1.default('wss://stream.data.alpaca.markets/v2/iex');
const listeners = new Map();
alpaca.on('open', () => {
    console.log('Connected to Alpaca');
    alpaca.send(JSON.stringify({
        action: 'auth',
        key: API_KEY,
        secret: SECRET_KEY,
    }));
});
alpaca.on('message', (data) => {
    const messages = JSON.parse(data.toString());
    console.log('ALPACA MESSAGE:', messages);
    for (const message of messages) {
        if (message.T === 'b') {
            console.log('🔥 CANDLE RECEIVED:', message);
            const candle = {
                symbol: message.S,
                open: message.o,
                high: message.h,
                low: message.l,
                close: message.c,
                volume: message.v,
                timestamp: message.t,
            };
            const symbolListeners = listeners.get(message.S);
            console.log('Listeners:', message.S, symbolListeners?.size);
            if (symbolListeners) {
                for (const listener of symbolListeners) {
                    listener(candle);
                }
            }
        }
    }
});
alpaca.on('error', (error) => {
    console.error('Alpaca error:', error);
});
alpaca.on('close', () => {
    console.log('Alpaca disconnected');
});
const subscribeToBars = (symbol) => {
    if (alpaca.readyState !== ws_1.default.OPEN) {
        console.log('Alpaca WebSocket is not ready');
        return;
    }
    alpaca.send(JSON.stringify({
        action: 'subscribe',
        bars: [symbol],
    }));
    console.log(`Subscribed to bars: ${symbol}`);
};
exports.subscribeToBars = subscribeToBars;
const onCandle = (symbol, callback) => {
    if (!listeners.has(symbol)) {
        listeners.set(symbol, new Set());
    }
    listeners.get(symbol).add(callback);
    return () => {
        listeners.get(symbol)?.delete(callback);
    };
};
exports.onCandle = onCandle;
exports.default = () => {
    console.log('Alpaca service started');
};
const getHistoricalBars = async (symbol, start, end) => {
    const url = new URL(`https://data.alpaca.markets/v2/stocks/${symbol}/bars`);
    url.searchParams.set('timeframe', '1Min');
    url.searchParams.set('feed', 'iex');
    const now = new Date();
    if (start) {
        url.searchParams.set('start', start);
    }
    else {
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        url.searchParams.set('start', oneHourAgo.toISOString());
    }
    if (end) {
        url.searchParams.set('end', end);
    }
    else {
        url.searchParams.set('end', now.toISOString());
    }
    const response = await fetch(url, {
        headers: {
            'APCA-API-KEY-ID': API_KEY,
            'APCA-API-SECRET-KEY': SECRET_KEY,
        },
    });
    if (!response.ok) {
        throw new Error(`Alpaca error: ${response.status}`);
    }
    return response.json();
};
exports.getHistoricalBars = getHistoricalBars;
