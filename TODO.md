# TODO — odprte zadeve

## 1. Pravi stock ticker (namesto simuliranega) — ✅ NAREJENO

`StockTicker.astro` zdaj kliče `/api/ticker` (server-side Finnhub endpoint, 30s cache).
Deployano in preverjeno, da vrača prave cene.

**⚠️ NUJNO pred 1.10.2026:** Vercel je Node.js 20 runtime označil kot deprecated in
gradnje z Node 20 po tem datumu ne bodo več delovale. Trenutna verzija adapterja
(`@astrojs/vercel@7.8.2`, zadnja, ki še podpira Astro 4) ne pozna Node 22/24 in bi se
brez ročne nastavitve vrnila na neveljaven `nodejs18.x` runtime. Zato je Vercel projekt
→ Settings → General → Node.js Version ročno nastavljen na **20.x** kot začasna rešitev.

Pred oktobrom 2026 je treba:
- Nadgraditi na Astro 5 + `@astrojs/vercel@8.x` (ki podpira novejše Node verzije), ALI
- Preveriti, ali je izšla novejša verzija adapterja za Astro 4 z popravljeno Node-version
  detekcijo, ki pravilno prepozna Node 22/24.

Brez tega ukrepa bo ticker (in vsak drug server-side endpoint) prenehal delovati.

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
