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
};