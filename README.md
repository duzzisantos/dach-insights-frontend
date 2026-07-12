# DACHInsights — Frontend

Next.js 16 (App Router) + TypeScript frontend for **DACHInsights**, a glassmorphic, animated statistics dashboard covering Germany, Austria, and Switzerland — architecturally modeled on [datausa.io](https://datausa.io).

Pairs with the [backend](https://github.com/duzzisantos/dach-insights-backend) (ASP.NET Core Web API). See that repo, or the deployment repo's `docker-compose.yml`/`DEPLOY.md`, for running both together.

## Stack

TypeScript, Tailwind CSS v4, Framer Motion, Radix UI primitives, Nivo (bar/line charts) + a hand-rolled d3-geo choropleth map, TanStack Query.

## Project structure

```
src/
├── app/            # routes: /, /[region], /category/[slug]
├── components/     # charts, layout, ui, providers
├── data/           # static GeoJSON boundaries for the choropleth map
└── lib/            # api client, types, formatters, i18n
```

Map boundaries: Germany from [deutschlandGeoJSON](https://github.com/isellsoap/deutschlandGeoJSON) (Unlicense); Austria and Switzerland from Eurostat/GISCO's [Nuts2json](https://github.com/eurostat/Nuts2json).

## Prerequisites

- Node.js 20+ (built/tested on Node 22)
- The [backend](https://github.com/duzzisantos/dach-insights-backend) API running and reachable

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:5080` | Base URL of the backend API, no trailing slash. Inlined into the client bundle at build time — in a same-origin reverse-proxy deployment (see `src/lib/api.ts`), set this to `""` and requests resolve as relative `/api/...` paths instead. |
| `API_INTERNAL_URL` | No | `http://backend:8080` | Server-only override for where SSR/RSC fetches hit the backend (e.g. a Docker-network hostname). Falls back to `NEXT_PUBLIC_API_URL` if unset. Never sent to the client. |

## Running it locally

```bash
cp .env.example .env.local   # edit if your API isn't on localhost:5080
npm install
npm run dev
# → http://localhost:3000
```

## Other scripts

```bash
npm run build   # production build
npm run start   # serve a production build
npm run lint    # eslint
```

## Docker

```bash
docker build -t dachinsights-frontend \
  --build-arg NEXT_PUBLIC_API_URL="http://localhost:5080" .
docker run -p 3000:3000 dachinsights-frontend
```

`NEXT_PUBLIC_API_URL` must be passed as a build arg, not a runtime env var — Next.js inlines `NEXT_PUBLIC_*` values into the client bundle at build time. For a same-origin reverse-proxy deployment, build with it left empty (`""`) and set `API_INTERNAL_URL` at runtime instead so SSR still reaches the backend directly. The container's `entrypoint.sh` logs which address SSR resolved to on startup. For running the full stack (Postgres + backend + frontend + Caddy) together, see the deployment repo's `docker-compose.yml` and `DEPLOY.md`.

## Security notes

CSP + security headers via `next.config.ts`, no secrets in the client bundle (only `NEXT_PUBLIC_API_URL`, which is not sensitive), search input length-capped both client and server side. `script-src` allows `'unsafe-inline'` for Next.js's own framework-injected bootstrap scripts — a nonce-based CSP is possible but requires opting every route out of Next's static rendering (see comment in `next.config.ts`); the app never uses `dangerouslySetInnerHTML` or interpolates user input into inline scripts, so the residual risk is small.

## Design system

Dark-first glassmorphic UI (light mode fully supported via the theme toggle) built on a validated, colorblind-safe categorical/sequential palette — see the chart components in `src/components/charts/` for the palette tokens (`src/app/globals.css`).
