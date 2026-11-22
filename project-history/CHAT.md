# AtlasSometria – Chat and Change Log

**Language:** **English (this file)** | [Deutsch (CHAT_DE.md)](CHAT_DE.md)

**Project:** [Schrotty74/AtlasSometria](https://github.com/Schrotty74/AtlasSometria)  
**Web app:** https://schrotty74.github.io/AtlasSometria/  
**Initial record date:** November 22, 2026  
**Purpose:** Traceable technical history and project handoff, independent of any single chat session.

> This document is a **summary of verifiable repository commits and tests actually performed in a browser**, not a verbatim chat transcript. Never publish personal health measurements, imported CSV files, screenshots, or private user details here.

## Current project structure

- `index.html` – static entry HTML with semantic markup, `data-i18n` hooks, PWA manifest/iOS icon links, and deferred classic scripts (`./i18n.js`, `./app.js`), usable offline via `file://` and on GitHub Pages without a build system.
- `styles.css` – stylesheet containing layout, responsive rules, interactive chart/modal styles, and all four color themes (Night Blue, Ivory, Café Latte, Neon — deduplicated).
- `i18n.js` – key-based English/German translation dictionary (`AtlasI18n`, 183 EN/DE keys, English default, German Beurer CSV keys preserved internally).
- `app.js` – dashboard logic, CSV import/export, interactive trend chart, comparison baselines, segment analysis, manual BMR/AMR entry, backup reminder, PWA install helper, and on-demand Tesseract.js OCR.
- `manifest.json` & `sw.js` – Web App Manifest and network-first static shell service worker (registered only on HTTPS/localhost, skipped on `file://`).
- `assets/favicon.svg`, `assets/logo.svg`, `assets/apple-touch-icon.png`, `assets/icon-192.png`, `assets/icon-512.png`, `assets/icon-maskable-512.png` – vector & PNG app icons.
- `README.md` and `README_DE.md` – English and German documentation.
- `AGENTS.md` – binding architecture, privacy, testing, and publication instructions.
- `project-history/CHAT.md` – this ongoing English change log and technical handoff.
- `project-history/CHAT_DE.md` – German version of the same history.

## Existing functionality and technical decisions

- Initially designed for **Beurer body-composition scales**, in particular **BF 990**, and CSV exports from **beurer HealthManager Pro**; compatibility with other scales is not generally guaranteed.
- CSV import, metric cards, history charts, segment analysis (arms, legs, trunk, visceral fat), manual BMR/AMR entry, optional screenshot OCR, enriched CSV export, and local browser storage.
- Four color themes: Night Blue, Ivory, Café Latte, and Neon.
- UI language defaults to **English**, with **German** available from the language selector; the preference is stored locally.
- Beurer data keys remain in German regardless of interface language; the importer expects a header including `Datum;Uhrzeit;`.
- **No embedded personal measurements** in the published application. Imported measurements must stay in the browser's local data store and must not be committed to GitHub.
- OCR requires an external library and possibly language files downloaded over the internet. Do not describe the application as entirely offline or free of network dependencies.
- Preserve existing data formats, localStorage keys, workflows, and features during changes.

## Change history (November 22, 2026)

The following commits have been verified in the repository's `main` branch. Commit IDs allow each change to be traced.

| Commit | Change | Verification status / note |
| --- | --- | --- |
| [4184c8584](https://github.com/Schrotty74/AtlasSometria/commit/4184c8584) | Initialized the repository. | GitHub commit present. |
| [658ce36f7](https://github.com/Schrotty74/AtlasSometria/commit/658ce36f7) | Published the sanitized web dashboard as `index.html`. | Public HTML starts without embedded personal measurements; syntax and source review performed at the time, but no complete browser regression test documented. |
| [612b8a9fe](https://github.com/Schrotty74/AtlasSometria/commit/612b8a9fe) | Added English README covering usage, privacy, and Beurer focus. | File published. |
| [63f12f0f3](https://github.com/Schrotty74/AtlasSometria/commit/63f12f0f3) | Added German `README_DE.md`. | File published. |
| [24727ff8f](https://github.com/Schrotty74/AtlasSometria/commit/24727ff8f) | Created `assets/favicon.svg`. | SVG fetched again from GitHub; browser appearance not documented as tested. |
| [423fbda07](https://github.com/Schrotty74/AtlasSometria/commit/423fbda07) | Added `assets/logo.svg`. | SVG fetched again from GitHub. |
| [4056b078f](https://github.com/Schrotty74/AtlasSometria/commit/4056b078f) | Linked favicon and application-title metadata in `index.html`. | Verified HTML references on GitHub. |
| [405b3d13f](https://github.com/Schrotty74/AtlasSometria/commit/405b3d13f) | Implemented initial English/German selector with English as default. | **Initially defective:** language switching did not work. |
| [6f3b35647](https://github.com/Schrotty74/AtlasSometria/commit/6f3b35647) | Attempted to fix switching in both directions. | Syntax passed; runtime defect persisted. |
| [ab51ed5ac](https://github.com/Schrotty74/AtlasSometria/commit/ab51ed5ac), [bbeef2256](https://github.com/Schrotty74/AtlasSometria/commit/bbeef2256) | Documented language switching in both README files. | Documentation updated. |
| [b0ca5a572](https://github.com/Schrotty74/AtlasSometria/commit/b0ca5a572) | Added English default HTML text and reversible translations. | Syntax passed; runtime error persisted. |
| [201e3f901](https://github.com/Schrotty74/AtlasSometria/commit/201e3f901) | Moved early `load(); render();` call. | Incomplete: `applyTheme()` still triggered rendering too early. |
| [eac9b8233](https://github.com/Schrotty74/AtlasSometria/commit/eac9b8233) | Displayed logo at the top of `README.md`. | Logo linked on repository home page. |
| [608211e9a](https://github.com/Schrotty74/AtlasSometria/commit/608211e9a) | Reduced README logo display width to 320 pixels. | Change retrieved from GitHub. |
| [c3874a9cc](https://github.com/Schrotty74/AtlasSometria/commit/c3874a9cc) | **Fixed root cause of language switching failure:** `applyTheme(storedTheme)` now runs after translation initialization. | **Tested on live GitHub Pages:** English → German → English successful; no startup JavaScript error; Night Blue → Ivory theme change successful. |
| [08ff2a717](https://github.com/Schrotty74/AtlasSometria/commit/08ff2a717) | Created mandatory quality, privacy, and testing rules in `AGENTS.md`. | File fetched again from GitHub after publication. |

## Important resolved issue: Language switching

**Symptom:** The “Language / Sprache” dropdown was present, but UI text did not change. The issue was reported in multiple browsers.

**Confirmed runtime cause:**
```text
ReferenceError: Cannot access 'I18N_PAIRS' before initialization
```

On startup, `applyTheme(storedTheme)` indirectly called `draw()` and `translateText()` before the `const I18N_PAIRS` translation table was initialized. This interrupted JavaScript initialization, including registration of the language selector event listener.

**Final correction:** Moved theme initialization after the translation table and helpers (commit `c3874a9cc`).

**Steps actually verified on the published web app:**
1. English was visible on first load, including the “Trends” heading.
2. Choosing “Deutsch” changed the heading to “Entwicklung” and displayed the German subtitle.
3. Switching back to “English” restored “Trends” and the English subtitle.
4. Changing the theme from Night Blue to Ivory succeeded.
5. No JavaScript startup errors were observed during this test.

**Do not overstate verification:** These checks do **not** establish that every measurement import, export, OCR workflow, device combination, or existing locally stored data set was regression-tested.

## Quality assurance for future changes

Before reporting a change as complete:
1. Read `AGENTS.md`, both README files, **both CHAT language versions**, and the affected code.
2. Reproduce failures in the browser and inspect runtime errors; fix root causes, not just symptoms.
3. Keep changes focused; preserve existing functionality, data formats, and localStorage.
4. Perform syntax/build checks **and** the affected real user workflow; test both directions for reversible interactions.
5. Before any public push, audit changed files for private data, tokens, local paths, and metadata; use synthetic test data only.
6. After deployment, verify the live site serves the new code and test the affected interaction again.
7. **Update both log languages after each project change**, recording date, affected files, commit, actual changes, cause, tests performed, and untested areas/blockers. Never invent tests or results.

## Documentation update: Bilingual project history

- **November 22, 2026:** Preserved the previous German change log as `CHAT_DE.md` and introduced its English equivalent as `CHAT.md`.
- **Requirement:** Keep both language versions synchronized in substance, with reciprocal links.
- **Verification scope:** File content and GitHub publication; no web-app changes and therefore no new app functional test.

## Last confirmed status and pending checks

- **Last confirmed working live test:** Modularized deployment (`3ea58e2a5`, `b82d94300`) verified live on `https://schrotty74.github.io/AtlasSometria/` (HTTP 200 & SHA-256 match); language switching, theme switching, and CSV import confirmed working by the user on the live site (November 22, 2026).
- **Project rules:** `AGENTS.md` has existed since commit `08ff2a717`.
- **Open / not covered by that verification:** `file://` offline check, CSV export/re-import round-trip, in-browser manual BMR/AMR entry, OCR testing across browsers, and full mobile layout regression.
- **Next change:** Review these open checks and the relevant functionality before implementation, then append entries to **both** language versions.

### 2026-11-22 – Modularized static architecture, key-based I18N, and targeted bugfixes
- Request / objective: Split the monolithic single-file `index.html` into maintainable static files (`index.html`, `styles.css`, `i18n.js`, `app.js`) without introducing a build step, replace fragile DOM text-replacement i18n with a key-based dictionary, and fix CSV export decimal formatting, calorie parsing, and screenshot/modal edge cases.
- Root cause or starting state: Previous repository state stored HTML, CSS, JavaScript, and a `MutationObserver`/substring-replacement translation layer in a single `index.html`. Screenshot uploads without a loaded CSV could still trigger OCR work, thousands separators in kcal values (e.g. `1.850` / `2,450`) could be misparsed, and CSV exports did not consistently format decimals with German commas.
- Files changed: `index.html`, `styles.css` (new), `i18n.js` (new), `app.js` (new), `README.md`, `README_DE.md`, `project-history/CHAT.md`, `project-history/CHAT_DE.md`.
- Implementation:
  - Split the single-file app into `index.html`, `styles.css`, `i18n.js`, and `app.js` alongside `assets/favicon.svg` and `assets/logo.svg`, keeping relative `./` paths and classic `<script defer>` tags so the app remains usable without a build step and via `file://`.
  - Replaced `MutationObserver`, `WeakMap` cache, and `alert`/`confirm` patches with a key-based EN/DE dictionary (`data-i18n` attributes and `t()` helper; English default, German switchable).
  - Preserved all three existing `localStorage` keys (`atlassometria-local-v1`, `atlassometria-theme-v1`, `atlassometria-language-v1`), all four themes, and German Beurer CSV source keys.
  - Bugfix: Aborted screenshot OCR immediately if no CSV measurements are loaded; revoked object preview URLs on modal close; added `Escape` key support to close the calorie modal.
  - Bugfix: Added dedicated `parseKcal()` handling thousands separators (`1.850`, `2,450`) for both manual calorie input and OCR.
  - Bugfix: Updated CSV export (`fmtCsvDecimal`) to write decimals with commas (e.g. `81,5`) for German Excel compatibility while keeping lossless re-import.
  - Hardened `showResult()` to use safe DOM construction (`textContent`) instead of HTML interpolation.
- Privacy audit (specific): Inspected all changed files; no embedded personal measurements, CSV exports, user credentials, tokens, or local paths; no external network requests on initial load (optional Tesseract.js loads on demand only during OCR).
- Syntax/build check (specific): Verified in this workspace via `node --check i18n.js`, `node --check app.js`, and an automated Node verification check of EN/DE I18N key parity (144/144 keys), all 26 metric labels, and `parseKcal()` cases (`1.850`, `2,450`, `1.850,5`).
- Browser functional test (steps and result): Confirmed by the user on the live GitHub Pages site (`https://schrotty74.github.io/AtlasSometria/`): language switching, theme switching, and CSV import worked as expected.
- Live deployment (URL and confirmed version): Verified live at `https://schrotty74.github.io/AtlasSometria/` after push: `/`, `/styles.css`, `/i18n.js`, `/app.js`, and `/assets/favicon.svg` all returned HTTP 200 with SHA-256 checksums identical to commits `3ea58e2a5` / `b82d94300`.
- Not tested / known limitations: `file://` offline loading, CSV export/re-import round-trip, manual calorie entry in browser, screenshot OCR across browsers, and full mobile layout regression were not verified in this test pass.
- Commit(s): [`3ea58e2a5`](https://github.com/Schrotty74/AtlasSometria/commit/3ea58e2a5) (modularized app code), [`b82d94300`](https://github.com/Schrotty74/AtlasSometria/commit/b82d94300) (documentation update), plus follow-up documentation sync for this live-test record.

### 2026-11-22 – Interactive chart tools, comparison baselines, single-delete, backup reminder, PWA home-screen support, and Neon CSS cleanup
- Request / objective: Implement the complete set of usability and iPhone-focused enhancements requested by the user while keeping the app purely static, bilingual (EN/DE), and backwards-compatible with existing `localStorage` data.
- Root cause or starting state: Trend chart displayed all measurements without range filtering, smoothing, or point inspection; metric deltas only compared against the immediately preceding entry; only full wipe was supported (no single-measurement delete); no backup reminder or PWA manifest/PNG icons existed; `styles.css` still contained an obsolete Neon v1 block superseded by Neon v2.
- Files changed: `index.html`, `styles.css`, `i18n.js`, `app.js`, `manifest.json` (new), `sw.js` (new), `assets/apple-touch-icon.png` (new), `assets/icon-192.png` (new), `assets/icon-512.png` (new), `assets/icon-maskable-512.png` (new), `README.md`, `README_DE.md`, `project-history/CHAT.md`, `project-history/CHAT_DE.md`.
- Implementation:
  - Interactive trend chart: Added time-range selector (`All`, `30 days`, `90 days`, `1 year`), toggleable 7-day rolling moving average (`computeMovingAverage`) with legend, and tap/hover canvas tooltips with crosshair highlighting.
  - Comparison baselines & management: Added card comparison selector (`prev`, `~7d`, `~30d`, `~90d`, `first`) showing the matched baseline date; added single-measurement deletion (`#deleteSelectedBtn`) with confirmation; added imported date range to CSV import banner; added auto-focus on manual calorie modal open.
  - Backup reminder: Added additive metadata key `atlassometria-backup-meta-v1` (without touching `atlassometria-local-v1`, `atlassometria-theme-v1`, or `atlassometria-language-v1`) to show a gentle export reminder when measurements are unbacked-up or outdated.
  - PWA / iPhone home-screen support: Added `manifest.json` (relative `./` paths for GitHub Pages), network-first static shell `sw.js` (HTTPS/localhost only, skipped on `file://`), generated PNG icons (`180px`, `192px`, `512px`, `512px maskable`) from `assets/favicon.svg`, and added an in-app install button + localized iOS Safari Add-to-Home-Screen guide modal.
  - CSS cleanup: Deduplicated redundant Neon v1 declarations in `styles.css` while preserving all four themes.
- Privacy audit (specific): Audited all added/modified files; no personal measurements, user CSVs, screenshots, tokens, or local paths; temporary user screenshot staging folder removed. External network traffic remains strictly limited to on-demand Tesseract.js OCR.
- Syntax/build check (specific): `node --check i18n.js`, `node --check app.js`, and `node --check sw.js` exited 0; automated Node suite verified `manifest.json` and PNG icon files, 183/183 EN/DE I18N key parity, all 42 DOM IDs and 68 HTML + 71 JS i18n keys, `parseKcal()` (`1.850`, `2,450`, `1.850,5`, `1920`), synthetic CSV import → comma-decimal export → lossless re-import round-trip, 7-day moving average math, and comparison baseline matching (`prev`, `7d`, `30d`, `first`).
- Browser functional test (steps and result): Not yet performed in a real browser after this update.
- Live deployment (URL and confirmed version): **Status updated after the original entry:** Published to GitHub `main` in commit [`c6e3534c3`](https://github.com/Schrotty74/AtlasSometria/commit/c6e3534c3295114d5fcdbac39894c51f94627c16). On November 22, 2026, the live GitHub Pages URL returned HTTP 200 and exposed the new HTML references and controls (manifest, `app.js`, range selector, install button, language selector). This confirms availability of the updated page structure, **not** functional verification of all new features.
- Not tested / known limitations: End-to-end browser functionality remains unverified for chart tap tooltips in iPhone Safari, 7-day average visuals across all 4 themes, single-delete, backup reminder, actual iOS home-screen installation, `file://` loading, OCR and existing-user data migration. Updated HTML availability on GitHub Pages was checked separately; this is not a functional test.
- Commit(s): [`c6e3534c3`](https://github.com/Schrotty74/AtlasSometria/commit/c6e3534c3295114d5fcdbac39894c51f94627c16) (`feat: add PWA support and enhance dashboard features`). The previous 'pending push' status referred only to the original draft.

---

### Template for future entries

```markdown
### YYYY-MM-DD – Short description
- Request / objective:
- Root cause or starting state:
- Files changed:
- Implementation:
- Privacy audit (specific):
- Syntax/build check (specific):
- Browser functional test (steps and result):
- Live deployment (URL and confirmed version):
- Not tested / known limitations:
- Commit(s):
```
