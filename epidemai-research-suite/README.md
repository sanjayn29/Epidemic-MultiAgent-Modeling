# EpidemAI Research Suite

EpidemAI Research Suite is a front-end research dashboard for epidemic modeling, multi-agent workflows, simulations, and report-oriented analytics.

## What This Project Does

The app presents a landing page, login flow, and several app sections for research, dashboarding, experiments, simulations, analytics, reports, network exploration, agent status, and settings. The UI is designed to look like an epidemic research control center, with cards, charts, workflow steps, and status views for ongoing studies.

## What Is In The App

- A marketing-style landing page that explains the platform
- A research workflow area for epidemic studies
- Dashboard views for experiments, agents, simulations, reports, and analytics
- A settings page for preferences and API key placeholders
- Reusable UI components for cards, tables, badges, and navigation

## Data And Backend Verdict

- This project does not contain a real application backend or real API routes.
- The server file at [src/server.ts](src/server.ts) is an SSR adapter for TanStack Start, not a custom business-logic backend.
- The visible project data comes from static in-memory mock files such as [src/lib/mock-data.ts](src/lib/mock-data.ts).
- The settings page shows API key inputs for OpenAI, Semantic Scholar, and Tavily, but they are only placeholder inputs and are not wired to a live service in the checked-in code.
- So the numbers, experiment rows, activity feed, and agent statuses should be treated as demo or fake data, not real research output.

## Tech Stack

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Radix UI
- React Query

## Folder Structure

- [src/routes](src/routes) - file-based application routes and app screens
- [src/components](src/components) - shared UI and feature components
- [src/lib](src/lib) - utilities and mock application data
- [public](public) - static assets and browser metadata

## Run Locally

```bash
bun install
bun run dev
```

To create a production build:

```bash
bun run build
```

## Notes

- The codebase is best understood as a polished demo or prototype for epidemic research workflows.
- If you want this to become a real product, the next step would be to replace the mock data with API calls and connect the settings page to actual secret storage.