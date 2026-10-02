"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = exports.binance = void 0;
const binance = async (symbol, interval) => {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`);
    const data = await res.json();
    // Convert candles
    const candles = data.map(x => [
        Number(x[6]), // close_time 
        Number(x[4]), // close
        Number(x[5]), // volume
        Number(x[1]), // open
        Number(x[2]), // high
        Number(x[3]), // low
        Number(x[0]), // open_time
        Number(x[7]), // quote_volume
    ]);
    return candles;
};
exports.binance = binance;
exports.apis = {
    binance: exports.binance,
};
