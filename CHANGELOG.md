# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-19

### Added
- Initial OSS release of StoryBridge AI, a narrative planning environment compatible with Story Plotter
- Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript stack
- Story Plotter format import/export (`.txt` / `.json` files) with no data loss
- Folder tree navigation for browsing stories, plots and subprojects
- Story/plot management with sequence units (Opening, MainStory, Finale)
- Character management with priority levels, tags, and extensible parameters
- Edit mode for modifying stories and characters directly in the browser
- Local persistence via `localStorage` with session recovery
- Parser for Story Plotter data format with bidirectional transformation
- MIT license
- CI workflow (GitHub Actions) with lint and build steps
- Project documentation:
  - README with quickstart guide and feature overview
  - CONTRIBUTING.md with development environment setup, branch naming, and PR process
  - CODE_OF_CONDUCT.md with community guidelines
  - docs/VISION.md with complete product vision and roadmap
- GitHub templates for issue reports, feature requests, and pull requests
