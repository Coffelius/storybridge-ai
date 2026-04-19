# StoryBridge AI

[![CI](https://github.com/Coffelius/storybridge-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Coffelius/storybridge-ai/actions/workflows/ci.yml)

StoryBridge AI is a narrative planning environment for authors, screenwriters
and content creators. It is compatible with the Story Plotter export format
and is designed to feed structured narrative context to Large Language
Models (LLMs) such as GPT-4 or Claude, so that generated content stays
coherent with the author's canon.

## Features

- Import and export Story Plotter `.txt` / `.json` files with no data loss.
- Folder tree navigation for browsing stories, plots and subprojects.
- Detailed story view with sequence units (Opening, MainStory, Finale).
- Character management with priority, tags and extensible parameters.
- Edit mode for modifying stories and characters directly in the browser.
- Local persistence via `localStorage`, no server required.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Quickstart

```bash
npm install
npm run dev
```

Then open <http://localhost:3000> and import a Story Plotter `.txt` or
`.json` export file.

## Roadmap

Short term: solid OSS release (MIT, CI, contribution docs).
Medium term: AI pipeline that compresses narrative context for LLM
prompts and optional provider integrations.

See [`docs/VISION.md`](docs/VISION.md) for the full product vision
(in Spanish).

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md)
for setup, branch naming and PR process, and the
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

Released under the [MIT License](LICENSE).
