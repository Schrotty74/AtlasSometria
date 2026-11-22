# AtlasSometria – Project Instructions

These instructions apply to every change to this repository, including changes made by AI coding assistants. Read existing documentation and relevant source code **before** making changes.

## Non-negotiable quality rule

**Do not report a fix or feature as finished merely because a file was edited, JavaScript parsed, a build passed, or a commit was pushed. Verify the affected real user workflow.** If an end-to-end test is technically unavailable, state exactly what was and was not verified. Never claim an unperformed check.

## Change history and chat handoff

Before starting work, read **both** [`project-history/CHAT.md`](project-history/CHAT.md) (English) and [`project-history/CHAT_DE.md`](project-history/CHAT_DE.md) (German). After each repository change, update **both language versions** with matching factual records with date, objective, affected files, root cause (if applicable), commit SHA, privacy check, actual tests performed, deployment verification, and anything not tested. This history is a technical handoff, not a verbatim private conversation transcript; never include personal health measurements, uploaded files, tokens, or sensitive metadata. Update both files as part of the same authorized publication workflow whenever feasible; maintain reciprocal language links.

## Required workflow

1. **Inspect first.** Read this file, the README files, and the relevant implementation. Check existing conventions, previous fixes, and potential interactions. Avoid unnecessary changes.
2. **Reproduce and diagnose.** For bug fixes, reproduce the symptom when possible. Capture the actual browser console/runtime error and find the root cause, not just the visible symptom. Check initialization order, event listeners, state and dependencies.
3. **Make a focused change.** Preserve the existing design, themes, UI controls, imports, exports, chart and segment calculations, and browser storage. Do not remove functionality, change file formats, or introduce dependencies without a specific reason.
4. **Verify the implementation.** Run syntax/static checks where available, then test the affected workflow in a real browser. Test both directions of reversible actions (for example English → German → English), initial load, reload/persistence, and relevant edge cases. Check for JavaScript console errors. A syntax check is **not** a functionality test.
5. **Check regressions.** Exercise related workflows that may be affected, including CSV import, diagrams, segment comparison, calorie-value editing, export, theme selection and language selection as appropriate to the change. Test mobile layout when a UI change can affect it. Report explicitly if a workflow was not tested.
6. **Audit privacy before any public push.** Review *every file being published* and the diff for real or sample personal health measurements, names/contact information, local machine paths, access tokens, passwords, private URLs, device identifiers, license keys, and sensitive metadata. Do not publish user-provided CSVs, screenshots, exports, logs or backups. If a privacy check fails, stop the publication until the issue is corrected. Do not print or commit sensitive values.
7. **Publish only with authorization.** Commit/push/deploy only when the user expressly requests it. Do not bump versions, create tags/releases, delete data, or overwrite user storage without an explicit request.
8. **Verify the public deployment.** After a requested GitHub Pages publication, confirm the **deployed website** serves the intended commit/content and actually test the changed interaction there. GitHub commit success does not prove a GitHub Pages deployment has completed. Distinguish stale deployment from a code defect.
9. **Report precisely.** Separate (a) implemented, (b) syntax/build checked, (c) functionally tested, (d) live deployment verified, and (e) not tested or blocked. Provide concise results and blockers; never say “everything works” without evidence.

## Project-specific compatibility and privacy

- AtlasSometria is a static HTML/CSS/JavaScript app, initially designed for Beurer body-composition scales, especially the BF 990 and the Beurer HealthManager Pro CSV export.
- **English is the default UI language**, with a working German/English selector. Keep the selected language in local browser preferences without changing measurement records.
- The Beurer CSV uses **German source column keys and formatting**, including `Datum;Uhrzeit;`. Keep data keys stable regardless of UI language; never translate source CSV keys internally in a way that breaks parsing or exports.
- Preserve existing localStorage measurement data and keys across updates. Do not clear or migrate/delete stored records without a safe, tested migration and explicit authorization.
- A public distribution must start without embedded personal measurements or personal demo data.
- Measurements are processed in the browser. Screenshot OCR loads a third-party library on demand; do not claim the app is entirely offline, dependency-free, or that external network metadata is never exposed.
- Keep the four supported themes, charts, body-segment analysis, manual BMR/AMR editing, optional screenshot OCR and enriched CSV export.
- Do not publish private data to tests, issue comments, CI logs, or screenshots. Use synthetic measurements for tests.

## Regression checklist for language/initialization changes

- First load works with empty storage, without any uncaught console errors.
- English appears on first use; switching to German changes static text **and** dynamically rendered text, and switching back restores English.
- Language persists across reloads; stored measurement records and numeric values are unchanged.
- Theme selection still works and persists; switching either language does not break charts or other event handlers.
- Watch initialization order carefully: do **not** call `render()`, `draw()` or `applyTheme()` before required translation constants and helpers are initialized.
- Validate the **live GitHub Pages URL** after the new version is actually deployed.

## Abschlussbericht (Deutsch)

In der Fertigmeldung ausdrücklich unterscheiden: **Änderung vorgenommen**, **Syntax/Build geprüft**, **Benutzerablauf im Browser getestet**, **Live-Version geprüft** und **nicht geprüft / blockiert**. Fehlerursache und Testumfang knapp nennen. Erfolg nur behaupten, wenn dieser tatsächlich überprüft wurde.
