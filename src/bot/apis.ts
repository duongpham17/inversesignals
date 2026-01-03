export interface IAlphaDailyMeta {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
};
export interface IAlphaDailyEntry {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
};
export interface IAlphaDailyResponse {
    "Meta Data": IAlphaDailyMeta;
    "Time Series (Daily)": {
        [date: string]: IAlphaDailyEntry;
    };
};
export interface IAlphaWeeklyResponse {
    "Meta Data": IAlphaDailyMeta;
    "Weekly Time Series": {
        [date: string]: IAlphaDailyEntry;
    };
};

export const alpha = async (symbol: string, interval: string) => {
    // Too Poor to call for 1w :(
    if(interval === "1w") return [];
    // -----------------------------
    
    const time_series = interval === "1d" ? "TIME_SERIES_DAILY" : "TIME_SERIES_WEEKLY";
    const res = await fetch(`https://www.alphavantage.co/query?function=${time_series}&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
    const data = await res.json();
    const series = interval === "1d" ? data["Time Series (Daily)"] as IAlphaDailyResponse : data["Weekly Time Series"] as IAlphaWeeklyResponse; 
    const mapped = Object.entries(series).map(([date, vals]) => {
        const [y, m, d] = date.split("-").map(Number);
        const ms = Date.UTC(y, m - 1, d)
        return [ 
                Number(ms),                   // close_time
                Number(vals["4. close"]),     // close
                Number(vals["5. volume"]),    // volume
                Number(vals["1. open"]),      // open
                Number(vals["2. high"]),      // high
                Number(vals["3. low"]),       // low
            ]
        });
    return mapped.reverse();
};

type TBinanceResponse = [number, string, string, string, string, string, number, string][];
export const binance = async (symbol: string, interval: string,) => {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`);
    const data: TBinanceResponse = await res.json();
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
        ]
    );
    return candles;
};

export const apis = {
    binance: binance,
    alpha: alpha
};