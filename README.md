# Stud Blox

An independent AI workspace for building Roblox experiences. Stud Blox is designed around a focused agent workflow: describe a system, inspect the proposed instance and script changes, connect Roblox Studio, then playtest before publishing.

## Product preview

This repository currently contains the polished web application shell and interaction prototype. It includes build sessions, model selection, a command palette, Studio connection state, a live-style Explorer, change review, playtesting states, and a responsive interface.

## Run locally

```bash
npm install
npm run dev
```

Build verification:

```bash
npm run build
```

## Architecture

- `src/App.tsx` — composed application workspace and interactions
- `src/data.ts` — typed demonstration data, isolated from UI
- `src/types.ts` — shared domain models
- `src/styles.css` — design system, responsive layout, and interaction states

## Product principles

- Reviewable changes before Studio mutation
- Clear connection, loading, empty, and test states
- Keyboard-first navigation and visible focus behavior
- Provider-neutral model UX
- Original code and visual identity; no third-party proprietary assets

## Roadmap

- Desktop runtime and secure credential storage
- Official Roblox Studio MCP transport
- Durable sessions and streamed agent events
- Script diffs, rollback checkpoints, and test assertions
- Provider adapters and usage controls

## License

MIT
