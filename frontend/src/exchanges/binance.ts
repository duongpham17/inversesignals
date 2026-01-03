export type TBinanceKlines = [number, number, number, number, number, number, number, number][];
export const klines = async (symbol: string, interval: string): Promise<TBinanceKlines> => {
    const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`);
    const data: TBinanceKlines = await res.json();
    // Convert candles
    const candles: TBinanceKlines = data.map(x => [
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

export type TBinanceSearchResults = { symbol: string, baseAsset: string, quoteAsset: string };
export const search = async (): Promise<TBinanceSearchResults[]> => {
    const resp = await fetch("https://api.binance.com/api/v3/exchangeInfo");
    const json = await resp.json();
    const symbols = json.symbols as TBinanceSearchResults[];
    const usdtPairs = symbols.filter(s => s.symbol.includes("USDT"));
    return usdtPairs;
};