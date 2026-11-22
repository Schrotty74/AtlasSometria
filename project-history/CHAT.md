# AtlasSometria – Chat and Change Log

**Language:** **English (this file)** | [Deutsch (CHAT_DE.md)](CHAT_DE.md)

**Project:** [Schrotty74/AtlasSometria](https://github.com/Schrotty74/AtlasSometria)  
**Web app:** https://schrotty74.github.io/AtlasSometria/  
**Initial record date:** November 22, 2026  
**Purpose:** Traceable technical history and project handoff, independent of any single chat session.

> This document is a **summary of verifiable repository commits and tests actually performed in a browser**, not a verbatim chat transcript. Never publish personal health measurements, imported CSV files, screenshots, or private user details here.

## Current project structure

- `index.html` – complete static web app with HTML, CSS, and JavaScript, served through GitHub Pages.
- `assets/favicon.svg` – scalable browser favicon.
- `assets/logo.svg` – logo shown on the repository home page.
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

- **Last confirmed working live test:** English ↔ German language switching and theme switching after commit `c3874a9cc` (November 22, 2026).
- **Project rules:** `AGENTS.md` has existed since commit `08ff2a717`.
- **Open / not covered by that verification:** Full synthetic CSV test, OCR testing across browsers, full mobile regression, and export/reimport consistency.
- **Next change:** Review these open checks and the relevant functionality before implementation, then append entries to **both** language versions.

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
