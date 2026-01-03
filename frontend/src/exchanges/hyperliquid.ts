import { useEffect, useRef, useState } from "react";

// [time, close, volume, open, high, low]
export type THyperliquidKlines = [number, number, number, number, number, number][];

const intervalToMs: Record<string, number> = {
  "1m": 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "30m": 30 * 60_000,
  "1h": 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
  "1w": 7 * 24 * 60 * 60_000
};

export function useHyperliquidKlines(
  coin: string,
  interval: keyof typeof intervalToMs = "1m", // interval string
  limit = 100
) {
  const wsRef = useRef<WebSocket | null>(null);
  const klinesRef = useRef<THyperliquidKlines>([]);
  const [klines, setKlines] = useState<THyperliquidKlines>([]);

  useEffect(() => {
    if (!coin) return;

    const intervalMs = intervalToMs[interval];
    let reconnectTimer: number;

    // Fetch historical candles
    const fetchHistoricalKlines = async () => {
      try {
        const now = Date.now();
        const startTime = now - intervalMs * limit;

        const res = await fetch("https://api.hyperliquid.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "candleSnapshot",
            req: { coin, interval, startTime, endTime: now }
          })
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch historical candles:", text);
          return [];
        }

        const data = await res.json();

        const historical: THyperliquidKlines = data.map((c: any) => [
          Number(c.t), // time
          Number(c.c), // close
          Math.round(c.v), // volume
          Number(c.o), // open
          Number(c.h), // high
          Number(c.l), // low
        ]);

        klinesRef.current = historical;
        setKlines(historical);
        return historical;
      } catch (err) {
        console.error("Failed to fetch historical klines", err);
        return [];
      }
    };

    // Connect to live trades WS
    const connectWS = () => {
      const ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          method: "subscribe",
          subscription: { type: "trades", coin }
        }));
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.channel !== "trades") return;

        for (const t of msg.data) {
          const price = Number(t.px);
          const size = Number(t.sz);
          const time = Math.floor(Number(t.time) / intervalMs) * intervalMs;

          let lastCandle = klinesRef.current[klinesRef.current.length - 1];

          if (!lastCandle || lastCandle[0] < time) {
            lastCandle = [time, price, size, price, price, price];
            klinesRef.current.push(lastCandle);
          } else {
            lastCandle[1] = price; // close
            lastCandle[2] += size; // volume
            lastCandle[4] = Math.max(lastCandle[4], price); // high
            lastCandle[5] = Math.min(lastCandle[5], price); // low
          }
        }

        setKlines([...klinesRef.current].slice(-limit));
      };

      ws.onclose = () => {
        reconnectTimer = window.setTimeout(connectWS, 1000);
      };

      ws.onerror = () => ws.close();
    };

    fetchHistoricalKlines().then(connectWS);

    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [coin, interval, limit]);

  return klines;
};

export type OrderBookEntry = { price: number; size: number };
export type OrderBook = {
  buys: OrderBookEntry[];
  sells: OrderBookEntry[];
};

export const useHyperliquidOrderBook = (coin: string, depth = 20) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [orderbook, setOrderbook] = useState<OrderBook>({ buys: [], sells: [] });

  useEffect(() => {
    if (!coin) return;

    const ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: "subscribe",
        subscription: { type: "l2Book", coin }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.channel === "l2Book" && msg.data && Array.isArray(msg.data.levels)) {
          const [bidLevels, askLevels] = msg.data.levels as any[][];

          const mapLevel = (lvl: any): OrderBookEntry => ({
            price: Number(lvl.px),
            size: Number(lvl.sz)
          });

          const buys: OrderBookEntry[] = (bidLevels || [])
            .map(mapLevel)
            .sort((a: OrderBookEntry, b: OrderBookEntry) => b.price - a.price) // highest bid first
            .slice(0, depth);

          const sells: OrderBookEntry[] = (askLevels || [])
            .map(mapLevel)
            .sort((a: OrderBookEntry, b: OrderBookEntry) => a.price - b.price) // lowest ask first
            .slice(0, depth);

          setOrderbook({ buys, sells });
        }
      } catch (err) {
        console.error("Error parsing Hyperliquid orderbook WS message:", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.warn("Hyperliquid WS closed");

    return () => ws.close();
  }, [coin, depth]);

  return orderbook;
}
