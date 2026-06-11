# HarborMaster QE Exercise

Welcome, and thanks for taking the time. This is a **time-boxed (60 minute)** exercise designed to
see how you approach testing a system you've never seen before. **You are encouraged to use AI tools
freely** — we're interested in how you direct them, not in whether you avoid them.

## The scenario

**HarborMaster** is a small marina-management web app. Marina staff use it to manage **vessels**,
**slips** (the berths boats tie up to), **reservations**, and **payments**. A new build was just
finished and handed to you for testing. There is **no QA sign-off yet** and the developers are fairly
confident it works — but it has not been thoroughly tested.

## Setup (clone & run — no Docker needed)

You only need **Node.js 18+** installed. Then:

```bash
npm install      # installs root, backend, and frontend dependencies in one step
npm run dev      # starts the API (http://localhost:4000) and the UI (http://localhost:5173)
```

Open **http://localhost:5173** for the application UI.
The HTTP API is served at **http://localhost:4000/api**.

To restore the data to its original seeded state at any time (e.g. after you've made a mess testing):

```bash
curl -X POST http://localhost:4000/api/admin/reset
```

> You have the full source repo, but **the goal is to test the running system as a black box** —
> exercise it through the UI and the HTTP API the way a user or an integrating client would. You're
> welcome to glance at the code, but findings should be demonstrated against the running app, not
> just asserted from reading source.

## Your mission

1. **Explore** the application (UI and/or API) and figure out what it's supposed to do.
2. **Find and document defects.** A defect is any behavior that a reasonable user, customer, or
   marina operator would consider wrong, risky, or surprising. For each one, capture:
   - a short title,
   - clear **reproduction steps** (UI clicks or an API call/`curl`),
   - **expected** vs. **actual** behavior (i.e. the rule you believe *should* hold), and
   - a **severity** that you assign and can justify.
3. **Write automated tests** that demonstrate the issues you found and that would catch the
   regressions in the future. **Use whatever stack you like** (e.g. Playwright, Cypress, Postman/Newman,
   supertest, pytest + requests, RestAssured, k6 — your call). Be ready to explain *why* you chose it.

> **Important:** No behavioral correctness is guaranteed by this document. Part of the task is
> deciding what *correct* should mean (your test oracles). The API reference below describes shapes,
> not promises.

## What we're evaluating

- **Breadth and depth** of the issues you surface — including subtle ones, not just obvious ones.
- **Prioritization** — can you tell a cosmetic glitch from a money/data-integrity problem?
- **Quality of your bug reports** — could a developer act on them without asking you questions?
- **Quality of your automated tests** — meaningful oracles, good coverage of edge cases, readable,
  and they'd actually fail against the buggy build and pass once fixed.
- **How you use AI** — directing it well is a skill we value.

We are **not** grading on how many tests you write or whether you find *every* issue. A few
well-chosen, well-tested, well-prioritized findings beat a long shallow list.

## Deliverables

- A **defect list** (markdown, spreadsheet, or issue tracker — your choice).
- A **runnable test project** (in this repo, a new folder, or a separate zip) with a short README
  explaining how to run it, what it covers, and your stack choice. Tests do not all need to pass —
  failing tests that correctly demonstrate a real bug are exactly what we want.

## Lightweight API reference

Base URL: `http://localhost:4000/api`. All request/response bodies are JSON.

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/health` | Liveness check |
| GET | `/vessels` | List vessels |
| GET | `/vessels/:id` | Get one vessel |
| POST | `/vessels` | Create a vessel |
| GET | `/slips` | List slips (supports `?status=`) |
| GET | `/slips/:id` | Get one slip |
| GET | `/slips/availability/summary` | Marina occupancy summary |
| GET | `/reservations` | List reservations (supports `?status=`, `?sort=date`, `?limit=`, `?offset=`) |
| GET | `/reservations/:id` | Get one reservation |
| POST | `/reservations` | Create a reservation |
| PATCH | `/reservations/:id/status` | Change reservation status |
| GET | `/payments?reservationId=` | List payments for a reservation |
| POST | `/payments` | Record a payment |
| POST | `/admin/reset` | Reset all data to the seeded state |

### Sample payloads

Create a vessel:
```json
POST /api/vessels
{ "name": "Sea Breeze", "lengthFt": 32, "beamFt": 11, "draftFt": 4, "ownerName": "Alice Marin" }
```

Create a reservation:
```json
POST /api/reservations
{ "vesselId": "v1", "slipId": "s1", "startDate": "2026-07-10", "endDate": "2026-07-13" }
```

Record a payment:
```json
POST /api/payments
{ "reservationId": "r1", "amount": 292.24, "method": "card" }
```

Reservation status values you'll see: `confirmed`, `checked_in`, `checked_out`, `cancelled`.

Good luck — and have fun poking at it.
