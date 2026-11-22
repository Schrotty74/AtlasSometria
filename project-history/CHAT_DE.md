# AtlasSometria – Chat- und Änderungsprotokoll

**Sprache:** [English (CHAT.md)](CHAT.md) | **Deutsch (diese Datei)**

**Projekt:** [Schrotty74/AtlasSometria](https://github.com/Schrotty74/AtlasSometria)  
**Web-App:** https://schrotty74.github.io/AtlasSometria/  
**Stand der Ersterfassung:** 22.11.2026  
**Zweck:** Nachvollziehbare Projektübergabe und technische Änderungschronik – unabhängig vom Chatverlauf.

> Dies ist eine **Zusammenfassung der nachweisbaren Repository-Commits und der tatsächlich im Browser durchgeführten Prüfungen**, kein vollständiges wörtliches Chat-Transkript. Keine persönlichen Messwerte, importierten CSV-Dateien, Screenshots oder privaten Nutzerangaben hier veröffentlichen.

## Aktuelle Projektstruktur

- `index.html` – statische Einstiegsseite mit `data-i18n`-Attributen und klassischen `<script defer>`-Einbindungen (`./i18n.js`, `./app.js`), weiterhin ohne Build-System offline per `file://` und über GitHub Pages nutzbar.
- `styles.css` – Stylesheet mit Layout, responsiven Regeln und allen vier Farbschemata (Nachtblau, Elfenbein, Café Latte, Neon).
- `i18n.js` – schlüsselbasiertes Englisch/Deutsch-Wörterbuch (`AtlasI18n`, Englisch als Standard, deutsche Beurer-CSV-Schlüssel bleiben intern unverändert).
- `app.js` – Dashboard-Logik, CSV-Import/-Export, Diagramme, Segmentanalyse, manuelle BMR-/AMR-Eingabe und bedarfsweises Tesseract.js-OCR.
- `assets/favicon.svg` – skalierbares Favicon.
- `assets/logo.svg` – Logo für die Repository-Startseite.
- `README.md` und `README_DE.md` – englische und deutsche Dokumentation.
- `AGENTS.md` – verbindliche Vorgaben zu Architektur, Datenschutz, Prüfung und Veröffentlichung.
- `project-history/CHAT.md` – englisches Änderungs- und Übergabeprotokoll.
- `project-history/CHAT_DE.md` – diese deutsche Fassung des Protokolls.

## Bestehende Funktionen und technische Festlegungen

- Zunächst für **Beurer-Körperanalysewaagen**, insbesondere **BF 990**, und den CSV-Export von **beurer HealthManager Pro** ausgelegt; keine pauschale Kompatibilitätszusage für andere Waagen.
- CSV-Import, Messwertkarten, Verlaufsgrafik, Segmentanalyse (Arme, Beine, Rumpf, Viszeral), manuelle BMR-/AMR-Ergänzung, optionale Screenshot-OCR, erweiterter CSV-Export und lokale Browser-Datenspeicherung.
- Vier Farbschemata: Nachtblau, Elfenbein, Café Latte und Neon.
- Oberfläche **standardmäßig Englisch**, umschaltbar auf **Deutsch**; Spracheinstellung lokal gespeichert.
- Beurer-Datenschlüssel bleiben unabhängig von der gewählten Oberflächensprache deutsch; der Import erwartet u. a. `Datum;Uhrzeit;`.
- **Keine eingebetteten persönlichen Messdaten** in der öffentlichen Anwendung. Eingelesene Messwerte gehören ausschließlich in den lokalen Browser-Datenspeicher und dürfen nicht nach GitHub gelangen.
- OCR benötigt bei Nutzung eine externe Bibliothek und ggf. Sprachdateien aus dem Internet. Daher nicht als vollständig offline oder netzwerkfrei beschreiben.
- Bestehende Datenformate, localStorage-Schlüssel, Bedienabläufe und Funktionen bei Änderungen erhalten.

## Änderungschronik (22.11.2026)

Die folgenden Commits sind im `main`-Branch des Repositories nachgewiesen; die IDs dienen der präzisen Rückverfolgung.

| Commit | Änderung | Prüfstatus / Hinweis |
| --- | --- | --- |
| [4184c8584](https://github.com/Schrotty74/AtlasSometria/commit/4184c8584) | Repository initialisiert. | GitHub-Commit vorhanden. |
| [658ce36f7](https://github.com/Schrotty74/AtlasSometria/commit/658ce36f7) | Bereinigtes Web-Dashboard als `index.html` veröffentlicht. | Öffentliches HTML startet ohne eingebettete persönliche Messungen; damalige Syntax- und Sichtprüfung, kein vollständiger Browserregressionstest dokumentiert. |
| [612b8a9fe](https://github.com/Schrotty74/AtlasSometria/commit/612b8a9fe) | Englisches README zur Bedienung, Datenschutz und Beurer-Ausrichtung. | Datei veröffentlicht. |
| [63f12f0f3](https://github.com/Schrotty74/AtlasSometria/commit/63f12f0f3) | Deutsches `README_DE.md` ergänzt. | Datei veröffentlicht. |
| [24727ff8f](https://github.com/Schrotty74/AtlasSometria/commit/24727ff8f) | `assets/favicon.svg` erstellt. | SVG auf GitHub zurückgelesen; visuelle Browserprüfung nicht dokumentiert. |
| [423fbda07](https://github.com/Schrotty74/AtlasSometria/commit/423fbda07) | `assets/logo.svg` ergänzt. | SVG auf GitHub zurückgelesen. |
| [4056b078f](https://github.com/Schrotty74/AtlasSometria/commit/4056b078f) | Favicon und App-Titel-Metadaten mit `index.html` verknüpft. | HTML-Verweise auf GitHub geprüft. |
| [405b3d13f](https://github.com/Schrotty74/AtlasSometria/commit/405b3d13f) | Erste Englisch/Deutsch-Umschaltung und englische Standardsprache implementiert. | **Initial fehlerhaft**: Sprachwechsel funktionierte nicht. |
| [6f3b35647](https://github.com/Schrotty74/AtlasSometria/commit/6f3b35647) | Korrekturversuch für Sprachwechsel in beide Richtungen. | Syntax erfolgreich; Funktionsfehler weiterhin vorhanden. |
| [ab51ed5ac](https://github.com/Schrotty74/AtlasSometria/commit/ab51ed5ac), [bbeef2256](https://github.com/Schrotty74/AtlasSometria/commit/bbeef2256) | Sprachfunktion in beiden READMEs dokumentiert. | Dokumentation aktualisiert. |
| [b0ca5a572](https://github.com/Schrotty74/AtlasSometria/commit/b0ca5a572) | Englische HTML-Ausgangstexte und umkehrbare Übersetzungen ergänzt. | Syntax erfolgreich; Laufzeitfehler blieb bestehen. |
| [201e3f901](https://github.com/Schrotty74/AtlasSometria/commit/201e3f901) | Frühen `load(); render();`-Aufruf verschoben. | Noch unvollständig: `applyTheme()` verursachte weiterhin zu frühes Rendering. |
| [eac9b8233](https://github.com/Schrotty74/AtlasSometria/commit/eac9b8233) | Logo ganz oben in `README.md` eingebunden. | Darstellung auf der Repository-Startseite verankert. |
| [608211e9a](https://github.com/Schrotty74/AtlasSometria/commit/608211e9a) | README-Logo auf 320 Pixel Breite verkleinert. | Änderung auf GitHub zurückgelesen. |
| [c3874a9cc](https://github.com/Schrotty74/AtlasSometria/commit/c3874a9cc) | **Ursache des Sprachfehlers behoben:** `applyTheme(storedTheme)` wird erst nach Initialisierung der Übersetzungen aufgerufen. | **Live auf GitHub Pages getestet:** Englisch → Deutsch → Englisch erfolgreich; kein JavaScript-Startfehler; Themewechsel Nachtblau → Elfenbein erfolgreich. |
| [08ff2a717](https://github.com/Schrotty74/AtlasSometria/commit/08ff2a717) | Verbindliche Qualitäts-, Datenschutz- und Testregeln in `AGENTS.md` angelegt. | Datei nach Upload auf GitHub zurückgelesen. |

## Wichtiger behobener Fehler: Sprachumschaltung

**Symptom:** Das Auswahlfeld „Language / Sprache“ war vorhanden, aber die angezeigten Texte wechselten nicht; das Problem trat in mehreren Browsern auf.

**Nachgewiesene Laufzeitursache:**
```text
ReferenceError: Cannot access 'I18N_PAIRS' before initialization
```
`applyTheme(storedTheme)` rief beim Seitenstart indirekt `draw()` und `translateText()` auf, bevor die als `const` deklarierte Übersetzungstabelle `I18N_PAIRS` initialisiert war. Dieser Fehler unterbrach die weitere JavaScript-Initialisierung einschließlich der Sprachauswahl.

**Endgültige Korrektur:** Theme-Initialisierung hinter die Definition der Übersetzungstabelle und Hilfsfunktionen verschoben (Commit `c3874a9cc`).

**Tatsächlich getesteter Ablauf auf der veröffentlichten Web-App:**
1. Englisch beim Öffnen sichtbar, unter anderem „Trends“.
2. Auswahl „Deutsch“ → Überschrift „Entwicklung“, deutscher Untertitel.
3. Zurück auf „English“ → „Trends“, englischer Untertitel.
4. Themewechsel Nachtblau → Elfenbein erfolgreich.
5. Während dieses Tests keine JavaScript-Startfehler beobachtet.

**Nicht als geprüft behaupten:** Vollständige Regression sämtlicher Messdatenimporte, Exporte, OCR-Abläufe, Gerätekombinationen und die Wirkung bei gespeicherten Altbeständen wurde damit **nicht** nachgewiesen.

## Qualitätssicherung für künftige Änderungen

Vor einer Fertigmeldung:
1. `AGENTS.md`, beide READMEs, diese `CHAT.md` sowie den betroffenen Code lesen.
2. Fehler im Browser nachvollziehen und Laufzeitkonsole prüfen; Ursache statt Symptom beheben.
3. Änderungen klein halten und bestehende Funktionen/Datenformate/localStorage erhalten.
4. Syntax/Build **und** betroffenen echten Benutzerablauf prüfen; bei umschaltbaren Funktionen beide Richtungen testen.
5. Vor öffentlichem Push geänderte Dateien auf private Daten, Tokens, Pfade und Metadaten prüfen; nur synthetische Testdaten verwenden.
6. Nach Veröffentlichung sicherstellen, dass die Live-Webseite den neuen Code ausliefert, und die Änderung dort erneut testen.
7. **Beide Sprachfassungen dieses Protokolls bei jeder künftigen projektbezogenen Änderung ergänzen**: Datum, Dateien, Commit, konkrete Änderung, Ursache, tatsächlich durchgeführte Tests, nicht geprüfte Bereiche/Blocker. Keine Tests oder Ergebnisse erfinden.

## Dokumentationsänderung: Zweisprachige Projekthistorie

- **22.11.2026:** Das bisherige deutsche Protokoll wurde als `CHAT_DE.md` erhalten und eine englische Fassung in `CHAT.md` eingeführt.
- **Vorgabe:** Beide Sprachfassungen bei künftigen Änderungen inhaltlich synchron halten; Links zwischen ihnen bereitstellen.
- **Prüfumfang:** Dateiinhalt und GitHub-Veröffentlichung; kein Eingriff in die Web-App und daher kein neuer App-Funktionstest.

## Letzter bestätigter Stand und offene Prüfungen

- **Letzte belegte funktionierende Live-Prüfung:** Sprachwechsel Englisch ↔ Deutsch und Themewechsel nach Commit `c3874a9cc` (22.11.2026).
- **Projektregeln:** `AGENTS.md` seit Commit `08ff2a717` im Repository.
- **Offen / nicht durch diesen Nachweis abgedeckt:** Vollständiger Test mit synthetischen CSV-Daten, OCR unter verschiedenen Browsern, vollständige mobile Regression und Export-Reimport-Konsistenz.
- **Nächste Änderung:** Vor Implementierung diese offene Liste und die betroffenen Funktionen prüfen, danach hier einen neuen Eintrag hinzufügen.

### 2026-11-22 – Modularisierte statische Struktur, schlüsselbasierte I18N und gezielte Bugfixes
- Auftrag/Ziel: Die bisherige Einzeldatei `index.html` ohne Build-Step in klar getrennte statische Dateien (`index.html`, `styles.css`, `i18n.js`, `app.js`) aufteilen, die Übersetzung auf ein festes Schlüssel-Wörterbuch umstellen sowie Fehler bei Screenshot-OCR, Kalorien-Parsing und CSV-Dezimalformat beheben.
- Ursache bzw. Ausgangszustand: Bisher lagen HTML, CSS, JavaScript und eine `MutationObserver`/Textersetzungs-Übersetzung zusammen in einer einzelnen `index.html`. Screenshot-Uploads ohne geladene CSV konnten unnötig OCR anstoßen, Tausendertrennzeichen in Kalorienwerten (`1.850` / `2,450`) wurden teils fehlinterpretiert und der CSV-Export nutzte nicht durchgängig deutsche Dezimalkommas.
- Geänderte Dateien: `index.html`, `styles.css` (neu), `i18n.js` (neu), `app.js` (neu), `README.md`, `README_DE.md`, `project-history/CHAT.md`, `project-history/CHAT_DE.md`.
- Umsetzung:
  - Einzeldatei in `index.html`, `styles.css`, `i18n.js` und `app.js` neben `assets/` (`favicon.svg`, `logo.svg`) aufgeteilt; relative `./`-Pfade und klassische `<script defer>`-Tags erhalten die Offline-Nutzbarkeit über `file://` ohne Build-Step.
  - Übersetzung (EN Standard / DE umschaltbar) auf festes Schlüssel-Wörterbuch (`data-i18n` + `t()`) umgestellt; `MutationObserver`, `WeakMap`-Cache und `alert`/`confirm`-Patches entfernt.
  - Bestehende `localStorage`-Schlüssel (`atlassometria-local-v1`, `atlassometria-theme-v1`, `atlassometria-language-v1`), alle vier Themes und deutsche Beurer-CSV-Schlüssel unverändert erhalten.
  - Bugfix: Screenshot-Upload ohne geladene CSV bricht sofort ab (kein OCR-Start im Hintergrund); Bild-Vorschau-URL wird beim Schließen sauber freigegeben; Kalorien-Modal lässt sich per `Escape` schließen.
  - Bugfix: `parseKcal()` erkennt Tausenderpunkte/-kommas (`1.850` / `2,450` kcal) bei manueller Eingabe und OCR korrekt.
  - Bugfix: CSV-Export (`fmtCsvDecimal`) schreibt Dezimalzahlen mit Komma (`81,5`) für deutsches Excel bei verlustfreiem Re-Import.
  - `showResult()` auf sicheres DOM-Rendering mit `textContent` umgestellt.
- Datenschutzprüfung (konkret): Alle geänderten Dateien geprüft; keine eingebetteten persönlichen Messdaten, CSV-Exporte, Zugangsdaten, Tokens oder lokalen Pfade; keine externen Ressourcen beim Start (Tesseract.js nur optional bei OCR).
- Syntax/Build (konkret): In diesem Arbeitsbereich geprüft mit `node --check i18n.js`, `node --check app.js` sowie einem automatisierten Node-Prüfskript für die EN/DE-Schlüsselparität, alle 26 Metrik-Labels und `parseKcal`-Fälle (`1.850`, `2,450`, `1.850,5`).
- Funktionstest im Browser (Schritte und Ergebnis): Echte Browser-Klickstrecke (inkl. `file://`-Offline-Test, EN ↔ DE, Themewechsel, synthetischer CSV-Import/-Export/-Reimport, OCR und Mobilansicht) noch nicht durchgeführt.
- Live-Deployment (URL und bestätigte Version): Code vom Nutzer nach `Schrotty74/AtlasSometria` gepusht; Live-Prüfung auf GitHub Pages (`https://schrotty74.github.io/AtlasSometria/`) steht noch aus.
- Nicht getestet / bekannte Einschränkungen: Vollständige Browser-Klickstrecke (inkl. `file://`, CSV-Import/Export-Reimport, OCR, mobile Ansicht) und Verifikation der Live-GitHub-Pages-Version noch offen.
- Commit(s): Durch Nutzer über AI-Studio-GitHub-Sync gepusht (Commit-SHA nach Dokumentations-Sync nachtragbar).

---

### Vorlage für zukünftige Einträge

```markdown
### YYYY-MM-DD – Kurzbezeichnung
- Auftrag/Ziel:
- Ursache bzw. Ausgangszustand:
- Geänderte Dateien:
- Umsetzung:
- Datenschutzprüfung (konkret):
- Syntax/Build (konkret):
- Funktionstest im Browser (Schritte und Ergebnis):
- Live-Deployment (URL und bestätigte Version):
- Nicht getestet / bekannte Einschränkungen:
- Commit(s):
```
