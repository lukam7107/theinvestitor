---
title: "IME PODJETJA — kratek naslov analize"
ticker: "TICKER"
borza: "npr. NASDAQ / NYSE / LJSE"
sektor: "npr. Tehnologija, Energetika ..."
datum: 2026-01-01
cena: 0.00
valuta: "USD"
marketCap: "npr. $500M"
fairValueMin: 0
fairValueMax: 0
fairValueValuta: "USD"
demo: false
povzetek: "Ena poved povzetka analize, prikazana na homepageu in listing strani."
bullCase:
  - "Bull argument 1"
  - "Bull argument 2"
  - "Bull argument 3"
bearCase:
  - "Bear argument 1"
  - "Bear argument 2"
  - "Bear argument 3"
---

Tu napiši razčlenitev poslovnega modela (business breakdown): kaj podjetje počne,
kako služi denar, konkurenčna prednost, panoga, management ipd.

Snapshot tabela, Bull/Bear tabela, Claude Fair Value box in Disclaimer se
generirajo avtomatsko iz zgornjih frontmatter podatkov — v telo datoteke napišeš
samo poslovni breakdown.

NAVODILA ZA UPORABO:
1. Skopiraj to datoteko v src/content/analize/ime-ticker.md
2. Izpolni frontmatter (podatki med --- na vrhu)
3. Napiši business breakdown spodaj
4. git add, commit, push — Vercel avtomatsko deploya novo analizo
