import WebSocket from 'ws';

const API_KEY = process.env.ALPACA_API_KEY;
const SECRET_KEY = process.env.ALPACA_SECRET_KEY;

if (!API_KEY || !SECRET_KEY) {
    throw new Error('Missing Alpaca API credentials');
}

const alpaca = new WebSocket(
    'wss://stream.data.alpaca.markets/v2/iex'
);

type Candle = {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: string;
};

const listeners = new Map<string, Set<(candle: Candle) => void>>();

alpaca.on('open', () => {
    console.log('Connected to Alpaca');

    alpaca.send(
        JSON.stringify({
            action: 'auth',
            key: API_KEY,
            secret: SECRET_KEY,
        })
    );
});

alpaca.on('message', (data) => {
    const messages = JSON.parse(data.toString());

    console.log('ALPACA MESSAGE:', messages);

    for (const message of messages) {

        if (message.T === 'b') {

            console.log('🔥 CANDLE RECEIVED:', message);

            const candle: Candle = {
                symbol: message.S,
                open: message.o,
                high: message.h,
                low: message.l,
                close: message.c,
                volume: message.v,
                timestamp: message.t,
            };

            const symbolListeners = listeners.get(message.S);

            console.log(
                'Listeners:',
                message.S,
                symbolListeners?.size
            );

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

export const subscribeToBars = (symbol: string): void => {
    if (alpaca.readyState !== WebSocket.OPEN) {
        console.log('Alpaca WebSocket is not ready');
        return;
    }

    alpaca.send(
        JSON.stringify({
            action: 'subscribe',
            bars: [symbol],
        })
    );

    console.log(`Subscribed to bars: ${symbol}`);
};

export const onCandle = (symbol: string, callback: (candle: Candle) => void): (() => void) => {
    if (!listeners.has(symbol)) {
        listeners.set(symbol, new Set());
    }

    listeners.get(symbol)!.add(callback);

    return () => {
        listeners.get(symbol)?.delete(callback);
    };
};

export default (): void => {
    console.log('Alpaca service started');
};

export const getHistoricalBars = async (symbol: string, start?: string, end?: string) => {
    const url = new URL(`https://data.alpaca.markets/v2/stocks/${symbol}/bars`);

    url.searchParams.set('timeframe', '1Min');
    url.searchParams.set('feed', 'iex');

    const now = new Date();

    if (start) {
        url.searchParams.set('start', start);
    } else {
        const oneHourAgo = new Date(
            now.getTime() - 60 * 60 * 1000
        );

        url.searchParams.set('start', oneHourAgo.toISOString());
    }

    if (end) {
        url.searchParams.set('end', end);
    } else {
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