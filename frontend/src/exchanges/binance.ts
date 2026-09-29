import { useEffect, useRef, useState } from "react";

// ============================================================
// Binance REST
// [close_time, close, volume, open, high, low, open_time, quote_volume]
// ============================================================
export type TBinanceKline = [number,number,number,number,number,number,number,number];
export type TBinanceKlines = TBinanceKline[];

export const klines = async (symbol: string, interval: string): Promise<TBinanceKlines> => {
  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`);

  if (!res.ok) throw new Error("Failed to fetch Binance klines");

  const data = await res.json();

  const candles: TBinanceKlines = data.map((x: any[]) => [
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


// ============================================================
// Binance Search
// ============================================================

export type TBinanceSearchResults = { symbol: string;baseAsset: string;quoteAsset: string; };
export const search = async (): Promise<TBinanceSearchResults[]> => {
  const resp = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  if (!resp.ok) throw new Error("Failed to fetch Binance symbols");
  const json = await resp.json();
  const symbols = json.symbols as TBinanceSearchResults[];
  return symbols.filter((s) => s.symbol.endsWith("USDT"));
};

// ============================================================
// Binance React WebSocket
// [time, close, volume, open, high, low]
// ============================================================
export type TBinanceChartKline = [number,number,number,number,number,number];
export type TBinanceChartKlines = TBinanceChartKline[];
// ============================================================
// Intervals
// ============================================================
const intervalToMs: Record<string, number> = {
  "1m": 60_000,
  "3m": 3 * 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "30m": 30 * 60_000,
  "1h": 60 * 60_000,
  "2h": 2 * 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "8h": 8 * 60 * 60_000,
  "12h": 12 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "3d": 3 * 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000,
};
// ============================================================
// WebSocket Hook
// ============================================================
export const useBinanceKlines = (symbol: string, interval: keyof typeof intervalToMs = "1m",limit = 100) => {
  const wsRef = useRef<WebSocket | null>(null);
  const klinesRef = useRef<TBinanceChartKlines>([]);
  const [klines, setKlines] = useState<TBinanceChartKlines>([]);

  useEffect(() => {
    if (!symbol) return;

    let isMounted = true;
    let reconnectTimer: number | undefined;

    const upperSymbol = symbol.toUpperCase();

    const binanceSymbol = upperSymbol.endsWith("USDT") ? upperSymbol : `${upperSymbol}USDT`;

    const fetchHistorical = async () => {
      const endTime = Date.now();
      const startTime = endTime - intervalToMs[interval] * limit;

      const url =
        `https://api.binance.com/api/v3/klines` +
        `?symbol=${binanceSymbol}` +
        `&interval=${interval}` +
        `&startTime=${startTime}` +
        `&endTime=${endTime}` +
        `&limit=${limit}`;

      try {
        const res = await fetch(url);

        if (!res.ok) return console.error("Binance historical error:", await res.text());

        const data = await res.json();

        const historical: TBinanceChartKlines =
          data.map((c: any[]) => [
            Number(c[0]), // time
            Number(c[4]), // close
            Number(c[5]), // volume
            Number(c[1]), // open
            Number(c[2]), // high
            Number(c[3]), // low
          ]);

        if (!isMounted) return;

        klinesRef.current = historical.slice(-limit);

        setKlines([...klinesRef.current]);

      } catch (error) {
        console.error("Binance historical error:", error);
      }
    };

    // ----------------------------------------
    // WebSocket
    // ----------------------------------------

    const connect = () => {
      if (!isMounted) return;

      if (wsRef.current) return;

      const url =
        `wss://stream.binance.com:9443/ws/` +
        `${binanceSymbol.toLowerCase()}@kline_${interval}`;

      const ws = new WebSocket(url);

      wsRef.current = ws;

      ws.onmessage = (event) => {
        if (!isMounted) return;

        try {
          const msg = JSON.parse(event.data);
          if (msg.e !== "kline") return;
          const k = msg.k;
          const candle: TBinanceChartKline = [
            Number(k.t),
            Number(k.c),
            Number(k.v),
            Number(k.o),
            Number(k.h),
            Number(k.l),
          ];

          const candles = klinesRef.current;
          const lastIndex = candles.length - 1;

          if ( lastIndex === -1 || candles[lastIndex][0] !== candle[0]) {
            // New candle
            candles.push(candle);
          } else {
            // Update current candle
            candles[lastIndex] = candle;
          };
          // Keep limit
          if (candles.length > limit) {
            candles.splice( 0, candles.length - limit );
          };
          // Force React update
          setKlines([...candles]);

        } catch (error) {
          console.error( "Binance message error:", error);
        }
      };

      ws.onerror = (error) => console.error("BINANCE WS ERROR:", error);

      ws.onclose = () => {
        console.log("BINANCE WS CLOSED");

        // Only this socket is allowed to clear the ref
        if (wsRef.current === ws) {
          wsRef.current = null;
        }

        // Don't reconnect if this socket was intentionally closed
        if (!isMounted) return;

        reconnectTimer = window.setTimeout(connect,1000);
      };
    };

    // ----------------------------------------
    // IMPORTANT:
    // Historical FIRST
    // WebSocket SECOND
    // ----------------------------------------

    fetchHistorical().then(() => {
      if (isMounted) connect();
    });

    // ----------------------------------------
    // Cleanup
    // ----------------------------------------

    return () => {
      isMounted = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = undefined;
      }

      const ws = wsRef.current;

      if (ws) {
        // Remove handlers BEFORE closing
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;

        ws.close();

        wsRef.current = null;
      }

      klinesRef.current = [];
    };

  }, [symbol, interval, limit]);

  return klines;
};