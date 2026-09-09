import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 ura
const RANGE = '6mo';
const INTERVAL = '1d';

interface HistoryPoint {
  date: string; // YYYY-MM-DD
  price: number;
}

interface CacheEntry {
  data: HistoryPoint[];
  ts: number;
}

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<HistoryPoint[]>>();

function fmtDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return d.toISOString().slice(0, 10);
}

async function fetchHistory(symbol: string): Promise<HistoryPoint[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=${RANGE}&interval=${INTERVAL}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance HTTP ${res.status}`);
  }

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('Ni podatkov v odgovoru');

  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

  const points: HistoryPoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i];
    if (typeof c === 'number' && !Number.isNaN(c)) {
      points.push({ date: fmtDate(timestamps[i]), price: Math.round(c * 100) / 100 });
    }
  }

  if (points.length === 0) throw new Error('Prazen niz cen');
  return points;
}

export const GET: APIRoute = async ({ url }) => {
  const symbol = url.searchParams.get('symbol')?.toUpperCase().trim();

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Manjka parameter symbol' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  const cached = cache.get(symbol);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }

  let promise = inFlight.get(symbol);
  if (!promise) {
    promise = fetchHistory(symbol).finally(() => {
      inFlight.delete(symbol);
    });
    inFlight.set(symbol, promise);
  }

  try {
    const data = await promise;
    cache.set(symbol, { data, ts: now });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    // Če imamo star cache, ga vseeno vrnemo namesto napake
    if (cached) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Zgodovina trenutno ni na voljo' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
