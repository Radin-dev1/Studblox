# Stud Blox

An independent AI workspace for building Roblox experiences. Stud Blox is designed around a focused agent workflow: describe a system, inspect the proposed instance and script changes, connect Roblox Studio, then playtest before publishing.

**Live site:** https://radin-dev1.github.io/Studblox/

The repository includes compiled root assets as a fallback for GitHub Pages installations configured to serve directly from `main`. The deployment workflow separately publishes the production `dist` artifact when Pages is configured for GitHub Actions.

The public URL opens on a black-and-white product website. Visitors can learn how Stud Blox works, review its local-model approach, use validated login/signup previews, and then enter the full creation workspace.

Authentication uses Supabase with four routes: email/password, Google, GitHub, and Discord. Configure `VITE_SUPABASE_URL` as a GitHub Actions variable and `VITE_SUPABASE_PUBLISHABLE_KEY` as a repository secret. Enable each OAuth provider in Supabase and allow `https://radin-dev1.github.io/Studblox/` as a redirect URL. Never place a Supabase service-role key in the frontend.

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
- Open-source local models first through Ollama or LM Studio
- Optional OpenAI, Anthropic, OpenRouter, or custom compatible APIs
- A five-stage quality gate: inspect, plan, implement, review, and playtest/repair

## AI configuration

Stud Blox defaults to Ollama with an open coding model, so a paid API is not required. Users can switch to LM Studio or add a cloud API from **AI providers**. API secrets must never be committed or exposed to the renderer; the desktop implementation should store them in the operating-system keychain.

The shared quality policy lives in `src/ai/providers.ts`. It requires the build agent to preserve existing systems, use server-authoritative Roblox patterns, review changes, run focused playtests, repair failures, and avoid claiming success without verification.

## Roadmap

- Desktop runtime and secure credential storage
- Official Roblox Studio MCP transport
- Durable sessions and streamed agent events
- Script diffs, rollback checkpoints, and test assertions
- Provider adapters and usage controls

## Studio tools

The interactive product preview includes four connected creation modes:

- **Script** — browse a Studio-style class tree, select an instance, edit Luau, and ask the AI to script with that selection as context.
- **Build game** — describe a complete experience and turn it into a reviewable system-by-system build plan.
- **Creator Store** — search and inspect models, images, audio, meshes, and materials before inserting them.
- **Generate** — create original 3D model or 2D image drafts for later review and Studio insertion.

The Creator Store, Studio mutation, and generation buttons are interface boundaries in the web preview. Production calls belong in the desktop main process so permissions, asset provenance, API credentials, and imported scripts can be checked safely.

## License

MIT
