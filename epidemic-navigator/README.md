# Epidemic Navigator

Epidemic Navigator is an interactive epidemic-research demo focused on asking a question, running a scripted multi-agent pipeline, and reviewing the resulting artifacts.

## What This Project Does

The app starts with a question entry screen and then opens a run view that walks through discovery, modeling, simulation, analysis, and report generation. The interface is built to feel like an autonomous research system, with a phase stepper, reasoning feed, artifacts panel, and a copilot review mode.

## What Is In The App

- A prompt screen for starting a new epidemic research run
- A live run page with phase-by-phase pipeline progress
- Scripted reasoning, tool-call, and artifact events
- Panels for network, series, paper, code, and table artifacts
- Review mode that pauses between phases for approval

## Data And Backend Verdict

- This project does not include a real backend service or custom API endpoints.
- The server file at [src/server.ts](src/server.ts) is the TanStack Start SSR entry point, not an application API layer.
- The pipeline state and outputs are generated locally by [src/lib/mock-pipeline.ts](src/lib/mock-pipeline.ts).
- The run view uses scripted events, generated networks, generated SEIR-like time series, and hand-authored paper metadata.
- Some cited paper details and DOI links point to real publications, but the pipeline itself is fake/demo data rather than live fetched research data.

## Tech Stack

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Radix UI
- React Query
- React Flow

## Folder Structure

- [src/routes](src/routes) - file-based application routes and app screens
- [src/components](src/components) - shared UI and domain-specific components
- [src/lib](src/lib) - pipeline simulation, themes, and utilities
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

- This repository is a strong prototype for demonstrating a multi-agent epidemic workflow.
- To make it production-ready, the mock pipeline would need to be replaced with real job execution, persistent storage, and API-backed data loading.