import type { APIRoute } from 'astro';

export const prerender = false;

const SYMBOLS = ['TSLA', 'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'NFLX'] as const;
const CACHE_TTL_MS = 30_000;

interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  pc: number; // previous close
}

interface TickerEntry {
  t: string;
  price: number;
  chg: number;
}

let cache: { data: TickerEntry[]; ts: number } | null = null;
let inFlight: Promise<TickerEntry[]> | null = null;

async function fetchQuote(symbol: string, apiKey: string): Promise<TickerEntry | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as FinnhubQuote;
    if (typeof data.c !== 'number' || data.c === 0) return null;
    return { t: symbol, price: data.c, chg: data.dp };
  } catch {
    return null;
  }
}

async function fetchAll(apiKey: string): Promise<TickerEntry[]> {
  const results = await Promise.all(SYMBOLS.map((s) => fetchQuote(s, apiKey)));
  return results.filter((r): r is TickerEntry => r !== null);
}

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'FINNHUB_API_KEY ni nastavljen' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  if (!inFlight) {
    inFlight = fetchAll(apiKey).finally(() => {
      inFlight = null;
    });
  }

  try {
    const data = await inFlight;
    if (data.length > 0) {
      cache = { data, ts: now };
    }
    return new Response(JSON.stringify(data.length > 0 ? data : cache?.data ?? []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  } catch {
    return new Response(JSON.stringify(cache?.data ?? []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
