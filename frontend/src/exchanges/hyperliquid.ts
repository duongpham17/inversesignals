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

export const useHyperliquidKlines = ( coin: string, interval: keyof typeof intervalToMs = "1m", limit = 100) => {
  const wsRef = useRef<WebSocket | null>(null);
  const klinesRef = useRef<THyperliquidKlines>([]);
  const [klines, setKlines] = useState<THyperliquidKlines>([]);

  useEffect(() => {
    if (!coin) return;

    const intervalMs = intervalToMs[interval];
    let reconnectTimer: number | undefined;
    let isMounted = true;

    // -------------------------
    // Fetch historical candles
    // -------------------------
    const fetchHistoricalKlines = async () => {
      try {
        const now = Date.now();
        const startTime = now - intervalMs * limit;

        const res = await fetch("https://api.hyperliquid.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "candleSnapshot",
            req: { coin, interval, startTime, endTime: now },
          }),
        });

        if (!res.ok) {
          console.error("Failed to fetch historical candles:", await res.text());
          return;
        }

        const data = await res.json();

        const historical: THyperliquidKlines = data.map((c: any) => [
          Number(c.t),
          Number(c.c),
          Math.round(c.v),
          Number(c.o),
          Number(c.h),
          Number(c.l),
        ]);

        klinesRef.current = historical;
        setKlines(historical);
      } catch (err) {
        console.error("Failed to fetch historical klines", err);
      }
    };

    // -------------------------
    // WebSocket connection
    // -------------------------
    const connectWS = () => {
      if (!isMounted || wsRef.current) return;

      const ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            method: "subscribe",
            subscription: { type: "trades", coin },
          })
        );
      };

      ws.onmessage = (e) => {
        if (!isMounted) return;

        const msg = JSON.parse(e.data);
        if (msg.channel !== "trades") return;

        for (const t of msg.data) {
          const price = Number(t.px);
          const size = Number(t.sz);
          const time =
            Math.floor(Number(t.time) / intervalMs) * intervalMs;

          if (!Number.isFinite(price) || !Number.isFinite(size)) continue;

          let lastCandle =
            klinesRef.current[klinesRef.current.length - 1];

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

      ws.onerror = (err) => {
        console.error("Hyperliquid WS error:", err);
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (isMounted) {
          reconnectTimer = window.setTimeout(connectWS, 1000);
        }
      };
    };

    // Init
    fetchHistoricalKlines().then(connectWS);

    // Cleanup
    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [coin, interval, limit]);

  return klines;
};

export type TOrderBookEntry = { price: number; size: number };
export type TOrderBook = { buys: TOrderBookEntry[]; sells: TOrderBookEntry[] };

export const useHyperliquidOrderBook = (coin: string, depth = 20) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [orderbook, setOrderbook] = useState<TOrderBook>({ buys: [], sells: [] });

  useEffect(() => {
    if (!coin) return;

    // Prevent duplicate WS
    if (wsRef.current) return;

    let isMounted = true;

    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
      wsRef.current = ws;
    } catch (err) {
      console.warn("Failed to create WebSocket:", err);
      return;
    }

    ws.onopen = () => {
      if (!isMounted || !ws) return; // ✅ check ws is not null
      try {
        ws.send(JSON.stringify({
          method: "subscribe",
          subscription: { type: "l2Book", coin }
        }));
      } catch {
        // ignore send errors
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.channel === "l2Book" && msg.data?.levels) {
          const [bidLevels, askLevels] = msg.data.levels as any[][];
          const mapLevel = (lvl: any) => ({ price: Number(lvl.px), size: Number(lvl.sz) });

          const buys = (bidLevels || [])
            .map(mapLevel)
            .sort((a, b) => b.price - a.price)
            .slice(0, depth);

          const sells = (askLevels || [])
            .map(mapLevel)
            .sort((a, b) => a.price - b.price)
            .slice(0, depth);

          setOrderbook({ buys, sells });
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      // just warn instead of error
      console.warn("Hyperliquid WS failed to connect");
    };

    ws.onclose = () => {
      console.warn("Hyperliquid WS closed");
      wsRef.current = null;
    };

    return () => {
      isMounted = false;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [coin, depth]);

  return orderbook;
};