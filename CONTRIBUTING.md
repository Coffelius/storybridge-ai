# Contributing to StoryBridge AI

Thanks for your interest in contributing. This document explains how to
set up your environment and how to propose changes.

## Development environment

- Node.js 20 or newer.
- Install dependencies:

  ```bash
  npm install
  ```

- Run the dev server:

  ```bash
  npm run dev
  ```

- Lint and build before pushing:

  ```bash
  npm run lint
  npm run build
  ```

## Branch naming

Work happens on short-lived branches cut from `develop`:

```
feature/<issue>-<slug>      # new features, e.g. feature/GAB-42-import-json
fix/<issue>-<slug>          # bug fixes
chore/<issue>-<slug>        # tooling, docs, refactors
```

## Commit style

One logical change per commit. Subjects use one of the following forms:

```
GAB-XX: <short subject>     # when there is an issue tracker id
TYPE: <short subject>       # TYPE ∈ {feat, fix, chore, docs, refactor, test}
```

The commit body (optional, wrapped at ~72 chars) should explain the
"why" of the change.

## Pull request process

1. Open a PR against `develop`, one feature per PR.
2. Fill in the PR template (summary, changes, testing, related issues).
3. Make sure CI is green (`lint` + `build`).
4. Request a review and address feedback in follow-up commits.
5. Squash-merge when approved.

## Code of Conduct

Participation in this project is governed by the
[Code of Conduct](CODE_OF_CONDUCT.md).
