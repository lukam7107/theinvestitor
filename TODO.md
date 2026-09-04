# TODO — odprte zadeve

## 1. Pravi stock ticker (namesto simuliranega)

Trenutno `src/components/StockTicker.astro` prikazuje simulirane (nepravé) cene, ki se
naključno premikajo. Dogovorjeno: zamenjati z dejanskimi tržnimi podatki preko
**Finnhub API**, s ključem skritim v Vercel serverless funkciji (ne v kodi/repoju).

Plan izvedbe (ko bomo nadaljevali):

1. **Ti narediš:** registracija na [finnhub.io/register](https://finnhub.io/register) (brezplačen tier), pridobiš API ključ.
2. **Ti narediš:** v Vercel projektu → Settings → Environment Variables → dodaš `FINNHUB_API_KEY` = tvoj ključ.
3. **Jaz naredim:**
   - Dodam `@astrojs/vercel` adapter v `astro.config.mjs`, `output: 'hybrid'` (vse strani ostanejo statične, samo API endpoint je server-side)
   - Ustvarim `src/pages/api/ticker.ts` — server-side endpoint, ki pokliče Finnhub za 8 tickerjev (TSLA, AAPL, MSFT, NVDA, GOOGL, AMZN, META, NFLX), s cache-anjem (30s), da ne prekoračimo brezplačnega rate limita (60 klicev/min)
   - Posodobim `StockTicker.astro` client script, da namesto naključne simulacije kliče `/api/ticker` vsakih ~30-60s in prikaže prave cene
   - Dodam `.env` v `.gitignore` (ključ nikoli ne gre v git repo)
4. Push, deploy, preverimo da dela na živi strani.

## 2. Ostalo iz prejšnjega pogovora (ni nujno v tem vrstnem redu)

- Zamenjava treh demo/placeholder analiz (XE, SIVE, SPCX) z dejansko vsebino
- Social share kartice (og:image) za lepši prikaz linkov na Instagram/X
- `sitemap.xml` za SEO
- Testni pošlji newsletter (preveriti celo verigo prijava → Buttondown → email)
- Instagram račun + prvi posti (carousel format iz analiz)
- Objava v slovenskih investicijskih skupinah/forumih ob lansiranju
- **FAQ stran** — "Ali je to investicijski nasvet?", "Kako izračunate Claude Fair Value?", "Kdo stoji za TheInvestitor?", "Kako pogosto izidejo nove analize?"
- **Privacy policy** — pomembno (GDPR), ker se zbirajo emaili preko newsletterja od EU/slovenskih uporabnikov
- **Kontakt stran** — viden `info@theinvestitor.com`, morda enostaven kontakt obrazec
- **Vercel Analytics** — vgrajen, brezplačen nivo, ena vrstica kode. Brez tega ne veš ali promocija deluje (koliko obiskovalcev, od kod, koliko se prijavi na newsletter)
- Affiliate linki (IBKR / Trading212) — ni nujno za lansiranje, del kasnejše monetizacije

## 3. Grafike / vizualije za naprej

- **Dinamični og:image generator** — avtomatska social-share slika za vsako analizo (ticker, fair value, brand barve), npr. z `@vercel/og` — namesto ene statične slike za celo stran
- **Instagram template sistem** — ponovljiv dizajn za carousel poste (quote kartice, stat kartice) v istem vizualnem jeziku kot stran
- **Prenosljiv PDF vsake analize** — lep "lead magnet", uporabniki lahko shranijo/natisnejo
- **Sektorske ikone** — vizualna popestritev chip oznak na karticah (npr. ikona za tehnologijo, energetiko ...)
- **Ilustracija za "O projektu" stran** — trenutno samo tekst, decorativen graf/ilustracija bi popestrila
- **Custom 404 stran** — manjša stvar, a doda profesionalen občutek
- **Avatar/portret za avtorja** — osebna nota na "O projektu" strani, gradi zaupanje
