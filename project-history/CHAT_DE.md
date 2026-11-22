# AtlasSometria – Chat- und Änderungsprotokoll

**Sprache:** [English (CHAT.md)](CHAT.md) | **Deutsch (diese Datei)**

**Projekt:** [Schrotty74/AtlasSometria](https://github.com/Schrotty74/AtlasSometria)  
**Web-App:** https://schrotty74.github.io/AtlasSometria/  
**Stand der Ersterfassung:** 22.11.2026  
**Zweck:** Nachvollziehbare Projektübergabe und technische Änderungschronik – unabhängig vom Chatverlauf.

> Dies ist eine **Zusammenfassung der nachweisbaren Repository-Commits und der tatsächlich im Browser durchgeführten Prüfungen**, kein vollständiges wörtliches Chat-Transkript. Keine persönlichen Messwerte, importierten CSV-Dateien, Screenshots oder privaten Nutzerangaben hier veröffentlichen.

## Aktuelle Projektstruktur

- `index.html` – vollständige statische Web-App mit HTML, CSS und JavaScript; direkt über GitHub Pages aufrufbar.
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

### 2026-11-22 – Modularisierte statische App-Dateien übernommen
- Auftrag/Ziel: Die vom Nutzer bereitgestellten modularisierten Dateien (`index.html`, `styles.css`, `i18n.js`, `app.js`) im Projektstamm übernehmen, damit sie nach GitHub synchronisiert werden können.
- Ursache bzw. Ausgangszustand: Bisher bestand das Repository aus einer einzelnen `index.html` mit Inline-CSS, Inline-JavaScript und Textersetzungs-Übersetzung.
- Geänderte Dateien: `index.html`, `styles.css` (neu), `i18n.js` (neu), `app.js` (neu), `project-history/CHAT.md`, `project-history/CHAT_DE.md`.
- Umsetzung: `index.html` aktualisiert und `styles.css`, `i18n.js` (schlüsselbasiertes EN/DE-Wörterbuch) sowie `app.js` (u. a. eigener Kalorien-Parser für Tausendertrennzeichen und sichere Initialisierungsreihenfolge) hinzugefügt. Alle drei `localStorage`-Schlüssel (`atlassometria-local-v1`, `atlassometria-theme-v1`, `atlassometria-language-v1`) und die deutschen Beurer-CSV-Schlüssel blieben unverändert. Temporären Upload-Ordner entfernt.
- Datenschutzprüfung (konkret): Alle vier Dateien geprüft; keine eingebetteten persönlichen Messwerte, CSV-Exporte, Zugangsdaten, Tokens oder lokale Pfade enthalten.
- Syntax/Build (konkret): `node --check i18n.js` und `node --check app.js` ohne Fehler (Exit-Code 0).
- Funktionstest im Browser (Schritte und Ergebnis): In diesem Arbeitsbereich nicht durchgeführt.
- Live-Deployment (URL und bestätigte Version): Noch nicht auf GitHub hochgeladen und nicht auf GitHub Pages geprüft (Sync über AI-Studio-Oberfläche steht aus).
- Nicht getestet / bekannte Einschränkungen: Vollständiger Browser-Funktionstest (Erststart, EN ↔ DE, Themewechsel, synthetischer CSV-Import/-Export, BMR/AMR-Dialog, OCR, Mobilansicht) sowie Prüfung der Live-Seite nach Veröffentlichung stehen noch aus.
- Commit(s): Ausstehend (Push durch Nutzer über GitHub-Sync).

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
