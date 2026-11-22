# AtlasSometria

**Body Composition Analytics** — a mobile-friendly, browser-based dashboard for body-composition measurements.

[Deutsch / German](README_DE.md) · [Open web app](https://schrotty74.github.io/AtlasSometria/)

## About

AtlasSometria was initially developed for **Beurer body-composition scales**, especially the **Beurer BF 990**, and the semicolon-separated CSV export from the **beurer HealthManager Pro** app. Other models or export formats have **not been verified**.

The application starts **without any preloaded, personal, or demonstration measurements**.

## Features

- Import Beurer HealthManager Pro weight/body-composition CSV exports.
- View key metrics in customizable dashboard cards, chart panels, and history trends.
- Compare left and right arms and legs, including differences; inspect trunk and visceral-fat readings.
- Switch between four color themes: Night Blue, Ivory, Café Latte, and Neon.
- Add basal and active metabolic rate (BMR/AMR) manually or attempt to recognize them from a measurement screenshot; always confirm recognized values.
- Export enriched CSV data and clear locally saved measurements.
- Responsive layout for phones, tablets, and desktop browsers.

Available values depend on the scale, the exported CSV columns, and the selected measurement. **Not every value displayed by HealthManager Pro is necessarily included in its CSV export.**

- **Language selector:** English is the default interface language. Switch to German in the app; the preference is stored locally. Beurer CSV column names remain German in both interface languages.

## Getting started

1. Open the [AtlasSometria web app](https://schrotty74.github.io/AtlasSometria/) in your browser (once GitHub Pages is enabled for this repository).
2. Export weight/body-composition data as **CSV** from beurer HealthManager Pro.
3. Select **Import CSV** in AtlasSometria and choose your exported CSV.
4. Optionally add BMR/AMR via the manual entry dialog or screenshot recognition.
5. Use the date picker, metric charts, segment cards, and theme selector to explore your measurements.
6. Use **Export enriched CSV** to keep a backup.

**CSV compatibility:** The importer currently expects the German Beurer header `Datum;Uhrzeit;...`, a semicolon delimiter, and German-style date/time values. Other exports may not import correctly.

## Privacy and limitations

- The public repository and HTML page contain **no built-in user measurements**.
- Imported CSV data is processed in the browser and saved in that browser's `localStorage` for the app's origin. The application has no user account, application backend, or automatic measurement upload.
- The screenshot is processed client-side by the OCR functionality. **On demand, the app loads Tesseract.js from the third-party jsDelivr CDN**, which requires a network connection and exposes ordinary network metadata (such as IP address) to that provider. The app does not intentionally upload screenshots to an application server. This is **not a fully offline or externally dependency-free app**.
- Data may be lost if browser storage is cleared, private browsing is used, or the browser/device changes. Export backups regularly.
- Anyone using the same browser profile/origin may be able to access locally stored measurements. Avoid shared devices for private health data.
- OCR can make mistakes; check all recognized values before saving.
- Body-composition readings are estimates, **not medical diagnoses**.
- This project is independently developed and is **not affiliated with or endorsed by Beurer**.

## Deploy with GitHub Pages

In **Settings → Pages**, select **Deploy from a branch**, choose branch **main** and folder **/(root)**, then save. The page will be available at:

https://schrotty74.github.io/AtlasSometria/

Opening the repository link itself shows source files; the GitHub Pages address opens the web app.

## Development

The app is a single static `index.html` with inline CSS and JavaScript. No build system or server is required. For local development, serve the repository through an HTTP server and open `index.html`. Test browser file-import and OCR support on each intended platform.

## License

See [LICENSE](LICENSE).