# FIFA World Cup 2026 — Frontend

Static, multi-page site (Tailwind via CDN + vanilla JS) wired to the
[football-data.org](https://www.football-data.org/) API for live matches,
group standings, top scorers, and the knockout bracket.

## Files

```
world-cup-2026/
├── index.html          Matches view + Scheduled/Live/Finished/All filters
├── groups.html          Group standings tables
├── knockout.html        5-round bracket: R32 → R16 → QF → SF → Final
├── stats.html           Top scorers
├── .gitignore           excludes js/config.js
└── js/
    ├── config.js         ⚠️ holds your API token — NOT committed to git
    ├── api.js             fetch wrapper for football-data.org v4
    ├── data.js            fallback mock data (used if the API call fails)
    ├── matches.js         renders + filters match cards
    ├── groups.js          renders standings tables
    ├── stats.js           renders top scorers
    └── knockout.js        renders the 5-round bracket
```

## Running it

Any static file server works, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open `index.html` (or any page) in the browser it serves.

## About the API token

`js/config.js` contains the football-data.org token you shared. Two things
worth doing before this goes anywhere public:

1. **Rotate the token.** It was pasted in a chat, so treat it as
   potentially exposed and generate a fresh one from your
   football-data.org account.
2. **Don't ship it client-side in production.** Right now the token is
   readable by anyone who opens dev tools, since it's called directly
   from the browser. That's fine for local development, but for a real
   deployment you'd want a tiny backend/serverless proxy that holds the
   token server-side and forwards requests, so it's never exposed in
   the page source.

## Notes on the fixes from the earlier review

- **Matches page skeletons:** the two placeholder cards were loading
  states with no data behind them, not broken output. `matches.js` now
  fills the grid from the API (or `MOCK_MATCHES` if the request fails)
  so there's nothing left unpopulated.
- **Knockout bracket:** the original mockup jumped straight from
  Round of 16 to the Final. `knockout.js` now renders all five real
  stages football-data.org exposes for a 32-team event: Round of 32,
  Round of 16, Quarterfinals, Semifinals, Final.
