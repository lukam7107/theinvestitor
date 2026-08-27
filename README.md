# TheInvestitor

Poglobljene delniške analize v slovenščini za balkanske/slovenske retail investitorje.

## Stack
- Astro (statični build)
- Vercel (hosting)
- Markdown datoteke za analize (brez baze, brez CMS)

## Lokalni razvoj

```bash
npm install
npm run dev
```

Odpri http://localhost:4321

## Dodajanje nove analize

1. Skopiraj `templates/analiza-template.md` v `src/content/analize/tvoj-ticker.md`
2. Izpolni frontmatter (cena, market cap, fair value, bull/bear case ...)
3. Napiši business breakdown v telo datoteke
4. `git add . && git commit -m "Nova analiza: TICKER" && git push`
5. Vercel avtomatsko zgradi in objavi novo stran na `/analize/tvoj-ticker`

## Build za produkcijo

```bash
npm run build
npm run preview
```

## Deploy

Repo je povezan z Vercel — vsak push na `main` avtomatsko deploya.
