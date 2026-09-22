import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_TTL_MS = 30_000;

interface FinnhubQuote {
  c: number; // trenutna cena
  d: number; // sprememba
  dp: number; // sprememba v %
  pc: number; // prejšnje zapiranje
}

interface QuoteData {
  price: number;
  chg: number;
  ts: number;
}

const cache = new Map<string, QuoteData>();
const inFlight = new Map<string, Promise<QuoteData>>();

async function fetchQuote(symbol: string, apiKey: string): Promise<QuoteData> {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  );
  if (!res.ok) throw new Error(`Finnhub HTTP ${res.status}`);
  const data = (await res.json()) as FinnhubQuote;
  if (typeof data.c !== 'number' || data.c === 0) throw new Error('Ni podatka o ceni');
  return { price: data.c, chg: data.dp, ts: Date.now() };
}

export const GET: APIRoute = async ({ url }) => {
  const symbol = url.searchParams.get('symbol')?.toUpperCase().trim();
  const apiKey = import.meta.env.FINNHUB_API_KEY;

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Manjka parameter symbol' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'FINNHUB_API_KEY ni nastavljen' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  const cached = cache.get(symbol);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }

  let promise = inFlight.get(symbol);
  if (!promise) {
    promise = fetchQuote(symbol, apiKey).finally(() => {
      inFlight.delete(symbol);
    });
    inFlight.set(symbol, promise);
  }

  try {
    const data = await promise;
    cache.set(symbol, data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  } catch {
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Cena trenutno ni na voljo' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
