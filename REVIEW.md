# Repository Review (2026-04-15)

## Scope
This review covers repository structure, dependency hygiene, and app-level implementation quality for the current Next.js TypeScript demo app.

## Findings

### 1) Unpinned dependencies (`latest`) hurt reproducibility (High)
**Where:** `package.json`

Using `latest` for runtime and dev dependencies makes local installs and CI builds non-deterministic. Different developers or CI runs can resolve different versions over time, causing hard-to-debug breakages.

**Recommendation:**
- Pin exact versions (or at least tight semver ranges).
- Commit a lockfile (`package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`).
- Add an upgrade workflow (e.g., Renovate/Dependabot) to keep pinned versions current.

### 2) Missing baseline quality scripts (Medium)
**Where:** `package.json`

The repo defines `dev`, `build`, and `start` scripts but no `lint`, `typecheck`, or `test`. This limits automated quality checks and makes regression detection harder.

**Recommendation:**
- Add scripts such as:
  - `lint` (ESLint / Next lint)
  - `typecheck` (`tsc --noEmit`)
  - `test` (unit/integration, as appropriate)

### 3) Root layout language mismatch with page content (Low)
**Where:** `app/layout.tsx`, `app/page.tsx`

`<html lang="en">` is set while the page content is in Danish (`"Velkommen til vores workshop med AAK"`). This can reduce accessibility quality (screen readers) and SEO language signaling.

**Recommendation:**
- Set `lang="da"` if Danish is the intended primary language, or localize content consistently.

### 4) Minimal app metadata and structure (Low)
**Where:** `README.md`, app files

The repository is intentionally minimal, but lacks operational documentation (setup, scripts, project purpose, architecture notes).

**Recommendation:**
- Expand `README.md` with install/run/build instructions and project intent.
- Optionally add `metadata` in Next layout for title/description.

## What was validated
- Repository file layout and source files.
- Package configuration and scripts.
- Basic semantic/accessibility alignment between content and document language.

## Environment note
Dependency installation was blocked by package-registry access policy in this environment, so runtime build/test execution could not be completed.
