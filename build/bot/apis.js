"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = exports.binance = exports.alpha = void 0;
;
;
;
;
const alpha = async (symbol, interval) => {
    // Too Poor to call for 1w :(
    if (interval === "1w")
        return [];
    // -----------------------------
    const time_series = interval === "1d" ? "TIME_SERIES_DAILY" : "TIME_SERIES_WEEKLY";
    const res = await fetch(`https://www.alphavantage.co/query?function=${time_series}&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
    const data = await res.json();
    const series = interval === "1d" ? data["Time Series (Daily)"] : data["Weekly Time Series"];
    const mapped = Object.entries(series).map(([date, vals]) => {
        const [y, m, d] = date.split("-").map(Number);
        const ms = Date.UTC(y, m - 1, d);
        return [
            Number(ms), // close_time
            Number(vals["4. close"]), // close
            Number(vals["5. volume"]), // volume
            Number(vals["1. open"]), // open
            Number(vals["2. high"]), // high
            Number(vals["3. low"]), // low
        ];
    });
    return mapped.reverse();
};
exports.alpha = alpha;
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
    alpha: exports.alpha
};
