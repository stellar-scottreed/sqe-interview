# HarborMaster

A small marina-management web app: manage **vessels**, **slips** (berths), **reservations**, and
**payments**.

## Requirements

- Node.js 18 or newer

## Setup & run

```bash
npm install      # installs root, backend, and frontend dependencies
npm run dev      # API on http://localhost:4000, UI on http://localhost:5173
```

Open **http://localhost:5173** for the UI. The HTTP API is at **http://localhost:4000/api**.

Reset all data to the seeded state at any time:

```bash
curl -X POST http://localhost:4000/api/admin/reset
```

## Project layout

```
backend/    Node + Express API with an in-memory data store (re-seeds on restart)
frontend/   React + Vite single-page app
scripts/    dev runner (starts API + UI together, no extra dependencies)
```

## Other commands

```bash
npm run dev:backend   # run only the API
npm run dev:frontend  # run only the UI
npm run build         # production build of the frontend
npm start             # run the API serving the built frontend on one port (4000)
```

## API overview

Base URL `http://localhost:4000/api`. See `CANDIDATE_INSTRUCTIONS.md` for endpoint details and
sample payloads.
