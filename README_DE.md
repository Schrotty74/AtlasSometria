# AtlasSometria

**Body Composition Analytics** – ein mobiloptimiertes, browserbasiertes Dashboard zur Auswertung von Körperzusammensetzungsdaten.

[English / Englisch](README.md) · [Web-App öffnen](https://schrotty74.github.io/AtlasSometria/)

## Über das Projekt

AtlasSometria wurde zunächst speziell für **Beurer-Körperanalysewaagen** entwickelt, insbesondere für die **Beurer BF 990** und die CSV-Exporte aus **beurer HealthManager Pro**. Andere Waagen und Exportformate sind **noch nicht verifiziert**.

Die Web-App startet **ohne persönliche oder vorinstallierte Beispieldaten**.

## Funktionen

- CSV-Messwerte aus beurer HealthManager Pro importieren.
- Gewicht, BMI, Körperfett, Muskeln und weitere exportierte Messwerte in farbigen Karten und Diagrammen anzeigen.
- Links-rechts-Vergleiche für Arme und Beine samt Differenzen; zusätzliche Ansichten für Rumpf und Viszeralfett.
- Vier Themes: Nachtblau, Elfenbein, Café Latte und Neon.
- Grundumsatz (BMR) und Leistungsumsatz (AMR) manuell ergänzen oder versuchsweise aus einem Screenshot erkennen; erkannte Werte vor dem Speichern bestätigen.
- Ergänzte Messdaten wieder als CSV exportieren und lokale Daten löschen.
- Responsive Darstellung für iPhone, Tablet und Desktop.

Welche Werte tatsächlich verfügbar sind, hängt von der Waage, den CSV-Spalten und der Messung ab. **Nicht jeder in HealthManager Pro sichtbare Wert wird zwingend in der CSV exportiert.**

- **Sprachauswahl:** Englisch ist die Standardsprache der Oberfläche. Du kannst in der App auf Deutsch umschalten; die Auswahl wird lokal gespeichert. Die deutschen Beurer-CSV-Spaltennamen bleiben unabhängig von der Oberflächensprache unverändert.

## Verwendung

1. Die [AtlasSometria-Web-App](https://schrotty74.github.io/AtlasSometria/) im Browser öffnen (nach Aktivierung von GitHub Pages).
2. In **beurer HealthManager Pro** die Körpermessungen als **CSV** exportieren.
3. In AtlasSometria **CSV importieren** auswählen und die Datei öffnen.
4. Fehlende BMR-/AMR-Werte bei Bedarf manuell oder über die Screenshot-Erkennung ergänzen.
5. Messdatum wählen, Diagramme und Segmentanalyse verwenden und gegebenenfalls ein Theme wechseln.
6. Mit **Ergänzte CSV exportieren** eine Sicherung anlegen.

**CSV-Kompatibilität:** Der Import erwartet derzeit die deutsche Beurer-Tabellenüberschrift `Datum;Uhrzeit;...`, Semikolon-Trennzeichen und deutsch formatierte Datums-/Zeitangaben. Andere Formate funktionieren möglicherweise nicht.

## Datenschutz und Einschränkungen

- Im öffentlich veröffentlichten HTML sind **keine persönlichen Messwerte enthalten**.
- Importierte Messungen werden im Browser verarbeitet und in dessen `localStorage` für die jeweilige Webadresse abgelegt. Es gibt kein Benutzerkonto, kein eigenes App-Backend und keinen automatischen Messdaten-Upload.
- Die Screenshot-Erkennung erfolgt im Browser. **Bei Bedarf lädt die App Tesseract.js über das externe jsDelivr-CDN**, wofür eine Internetverbindung erforderlich ist und übliche Verbindungsmetadaten (etwa die IP-Adresse) beim Anbieter anfallen. Die App lädt Screenshots nicht absichtlich auf einen eigenen Server hoch. Sie ist damit **nicht vollständig offline oder frei von externen Abhängigkeiten**.
- Browserdaten können gelöscht werden; private Browserfenster oder andere Geräte verwenden nicht automatisch denselben Datenbestand. Deshalb regelmäßig CSV-Backups exportieren.
- Wer dasselbe Browserprofil nutzt, könnte lokal gespeicherte Daten sehen. Für sensible Messungen keine gemeinsam genutzten Geräte verwenden.
- Die OCR-Texterkennung kann Werte falsch erkennen. Vor dem Speichern kontrollieren.
- Körperanalysewerte sind Schätzungen und **keine medizinische Diagnose**.
- Unabhängiges Projekt, **keine Zugehörigkeit zu Beurer und keine offizielle Beurer-App**.

## GitHub Pages einrichten

Unter **Settings → Pages** die Option **Deploy from a branch** auswählen, Branch **main** und Ordner **/(root)** einstellen und speichern. Danach ist die Web-App unter folgender Adresse erreichbar:

https://schrotty74.github.io/AtlasSometria/

Die Repository-Adresse zeigt den Quellcode, während die GitHub-Pages-Adresse die Web-App direkt startet.

## Technik

AtlasSometria ist eine statische `index.html` mit integriertem CSS und JavaScript. Ein Build-System ist nicht erforderlich. Lokal kann die Datei mit einem einfachen HTTP-Server bereitgestellt werden. Dateiimporte und OCR sollten auf den verwendeten Browsern praktisch getestet werden.

## Lizenz

Siehe [LICENSE](LICENSE).