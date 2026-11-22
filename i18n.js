'use strict';

/**
 * AtlasSometria I18N (EN default, DE switchable).
 * Key-based dictionary without MutationObserver or DOM substring replacement.
 * Works offline via file:// as a classic deferred script (no ES-module CORS issues).
 *
 * Important: German Beurer CSV column keys (Datum, Uhrzeit, Körperfett, etc.)
 * are never translated internally; they are only mapped for UI display.
 */
(function initAtlasI18n(global) {
  const LANG_STORAGE_KEY = 'atlassometria-language-v1';

  const TRANSLATIONS = {
    en: {
      // Page & header
      'page.title': 'AtlasSometria · Body Composition Analytics',
      'header.eyebrow': 'Body Composition Analytics',
      'header.subtitle': 'Your body composition. Clearly visualized. Stored locally. No account.',
      'actions.importCsv': '＋ Import CSV',
      'actions.importCsvAria': 'Choose CSV file',
      'actions.readScreenshot': '▧ Read screenshot',
      'actions.readScreenshotAria': 'Choose screenshot',
      'actions.installApp': '↓ Install app',
      'actions.installAppIos': '＋ Add to Home Screen',
      'theme.label': 'Color theme',
      'theme.aria': 'Choose color theme',
      'theme.dark': 'Night Blue (default)',
      'theme.ivory': 'Ivory',
      'theme.latte': 'Café Latte',
      'theme.neon': 'Neon',
      'lang.label': 'Language / Sprache',

      // Comparison baseline selector
      'compare.label': 'Compare cards with',
      'compare.aria': 'Comparison baseline',
      'compare.prev': 'Previous measurement',
      'compare.7d': '~7 days earlier',
      'compare.30d': '~30 days earlier',
      'compare.90d': '~90 days earlier',
      'compare.first': 'First measurement',

      // Section headings
      'status.sectionAria': 'Additional measurements and trends',
      'trends.title': 'Trends',
      'trends.subtitle': 'Trends from your imported measurements',
      'trends.metricAria': 'Chart metric',
      'trends.rangeAria': 'Time range',
      'trends.rangeAll': 'All dates',
      'trends.range30': '30 days',
      'trends.range90': '90 days',
      'trends.range365': '1 year',
      'trends.dateAria': 'Selected measurement',
      'trends.chartAria': 'Measurement history chart',
      'trends.ma7': '7-day average',
      'composition.label': 'Body composition',
      'composition.note': 'These percentages represent different metrics and do not add up to 100%.',

      'segments.title': 'Segment analysis',
      'segments.subtitle': 'Six measurement areas in four cards: left/right arms and legs with differences',
      'segments.label': 'Arms and legs: left, right and their differences at a glance',
      'segments.note': 'Bars show percentages on a 0–100% scale, not medical reference ranges. Other metrics appear under “Additional measurements”.',
      'segments.leftRight': 'Left & right',
      'segments.left': 'Left',
      'segments.right': 'Right',
      'segments.diffLR': 'Difference L − R',
      'segments.selected': '✓ Selected',
      'segments.tapHint': 'Tap for details',
      'segments.noComplete': 'Incomplete values',
      'segments.equal': 'Both sides equal',
      'segments.sideHigher': '{side} {diff} pp higher',
      'segments.ppUnit': 'pp',
      'segments.summary': 'Both sides and their differences are shown together in each card. pp = percentage points; difference = left minus right.',
      'segments.visceralIndex': 'Visceral fat index',
      'segments.visceralNote': 'Index value without muscle percentage.',

      // Segment area display names
      'segment.Arme': 'Arms',
      'segment.Beine': 'Legs',
      'segment.Rumpf': 'Trunk',
      'segment.Viszeral': 'Visceral',

      // Additional measurements
      'other.title': 'Additional measurements',
      'other.subtitle': 'All other measurements at a glance',
      'other.metabolism': 'Metabolism and heart rate',
      'other.bodyMass': 'Body mass',

      // Data management & footer
      'manage.title': 'Import & data management',
      'manage.subtitle': 'You stay in control of your measurements',
      'manage.manualBtn': '＋ Enter calorie values manually',
      'manage.exportBtn': '↓ Export enriched CSV',
      'manage.deleteSelectedBtn': 'Delete selected measurement',
      'manage.clearBtn': 'Clear all local data',
      'manage.notice': "The Beurer CSV may omit basal and active metabolic rate. You can read these two values from a screenshot and link them to a measurement. The OCR library is downloaded on demand; image processing runs in the browser and the image is not sent to this app's server.",
      'footer.text': 'AtlasSometria · Private browser-based web app · Scale readings are estimates, not medical diagnoses. Data is stored only in your browser (if local storage is enabled). Clearing browser data may remove it; export enriched CSV backups regularly.',

      // Modal
      'modal.title': 'Add calorie values',
      'modal.closeAria': 'Close',
      'modal.desc': 'Values are saved only after you confirm. If you have several measurements, select the correct date.',
      'modal.previewAlt': 'Selected screenshot',
      'modal.measurement': 'Measurement',
      'modal.bmrLabel': 'Basal metabolic rate (kcal)',
      'modal.amrLabel': 'Active metabolic rate (kcal)',
      'modal.kcalPlaceholder': 'Enter kcal',
      'modal.apply': 'Apply values',
      'modal.cancel': 'Cancel',

      // iOS install guide modal
      'install.iosTitle': 'Add AtlasSometria to Home Screen',
      'install.iosIntro': 'Install AtlasSometria on your iPhone or iPad for full-screen launch and quick access:',
      'install.iosStep1': "Tap the Share button in Safari's toolbar.",
      'install.iosStep2': 'Scroll down and choose “Add to Home Screen”.',
      'install.iosStep3': 'Confirm by tapping “Add” in the top right.',
      'install.done': 'Got it',
      'install.installedToast': 'AtlasSometria was installed.',

      // Dynamic dashboard states
      'empty.state': 'No measurements yet. Import a Beurer CSV.',
      'delta.none': 'No comparison yet',
      'delta.same': '→ Unchanged since previous measurement',
      'delta.up': '↑ +{diff}{unit} since previous measurement',
      'delta.down': '↓ −{diff}{unit} since previous measurement',
      'delta.sameDate': '→ Unchanged vs. {date}',
      'delta.upDate': '↑ +{diff}{unit} vs. {date}',
      'delta.downDate': '↓ −{diff}{unit} vs. {date}',
      'spark.minTwo': 'Trend available from 2 measurements',
      'spark.aria': 'Trend over the last {count} measurements',

      // Chart notes & tooltips
      'chart.single': 'Only one measurement so far — import more CSV files to see trends.',
      'chart.points': '{count} data points · {metric} · Tap or hover points for details',
      'chart.pointsInRange': '{count} of {total} data points · {metric} · Tap or hover points for details',
      'chart.noValues': 'No values for this metric.',
      'chart.noValuesInRange': 'No values in this time range.',
      'chart.noData': 'No chart data yet',
      'chart.legendValue': 'Measured value',
      'chart.legendMa7': '7-day average',
      'chart.tooltipMa7': '7d avg: {value}{unit}',

      // Storage & backup reminder
      'storage.saved': '{count} measurement(s) saved locally.',
      'storage.unavailable': 'Local storage unavailable. Export an enriched CSV.',
      'storage.summary': '{total} measurement(s) in dashboard · {withKcal} with both calorie values',
      'backup.never': 'Reminder: You have {count} local measurements and no CSV backup exported yet.',
      'backup.old': 'Reminder: Your last CSV backup was {days} days ago ({changes} change(s) since).',
      'backup.changes': 'Reminder: {changes} change(s) since your last CSV backup.',
      'backup.exportNow': 'Export backup now',

      // Import / Export / Clear messages
      'import.readingTitle': 'Reading CSV …',
      'import.readingDetail': 'File: {file}',
      'import.doneTitle': 'CSV processed successfully',
      'import.doneSame': '{added} new measurement(s), {updated} existing measurement(s). These values were already imported, so charts remain unchanged.',
      'import.doneChanged': '{added} new measurement(s), {updated} existing measurement(s). Updated values now appear in the dashboard.',
      'import.doneRange': 'Imported date range: {from} – {to}',
      'import.doneTotal': 'Total: {total} measurement(s). Trends are available after at least two measurement dates.',
      'import.toastDone': 'CSV import complete.',
      'import.failTitle': 'CSV import failed',
      'import.failAlert': 'Import failed: {message}',
      'error.noBeurerTable': 'No Beurer weight table (Datum;Uhrzeit;...) found.',
      'error.noValidRows': 'No valid weight measurements found.',

      // Calorie edit & OCR
      'edit.needCsv': 'Import a Beurer CSV first.',
      'edit.scanPrompt': 'Choose a screenshot to attempt automatic calorie value recognition.',
      'edit.manualPrompt': 'Enter or edit calorie values.',
      'edit.invalidKcal': 'Enter plausible calorie values.',
      'edit.noSelection': 'No measurement selected.',
      'edit.savedToast': 'Calorie values saved for the measurement.',
      'edit.savedTitle': 'Calorie values applied',
      'edit.savedDetail': 'Basal metabolic rate: {bmr} kcal · Active metabolic rate: {amr} kcal. They appear under “Additional measurements”.',

      'ocr.selectedTitle': 'Screenshot selected',
      'ocr.selectedDetail': 'Image: {file}. Recognized calorie values appear in the confirmation dialog first and are not saved automatically.',
      'ocr.running': 'OCR is running locally in the browser. Required language models may be downloaded on demand.',
      'ocr.progress': 'Recognizing text: {percent} %',
      'ocr.loadError': 'Could not load OCR. Check your internet connection.',
      'ocr.foundModal': '{count} of 2 calorie values recognized. Please verify and select “Apply values” to save.',
      'ocr.noneModal': 'No unambiguous calorie values recognized. Please enter values manually from the screenshot.',
      'ocr.doneTitle': 'Screenshot recognition complete',
      'ocr.doneFound': '{count} of 2 calorie values recognized. Check the dialog and select “Apply values”.',
      'ocr.doneNone': '0 of 2 calorie values recognized. Enter the values manually in the dialog.',
      'ocr.failModal': 'Automatic recognition failed: {message} You can still enter values manually.',
      'ocr.failTitle': 'Screenshot OCR unavailable',
      'ocr.failDetail': '{message} Enter the values manually in the dialog and select “Apply values”.',

      // Export, single delete & clear
      'export.empty': 'No data to export.',
      'export.done': 'Enriched CSV created.',
      'deleteSelected.empty': 'No measurement selected to delete.',
      'deleteSelected.confirm': 'Delete the measurement from {date} · {time}? This action cannot be undone.',
      'deleteSelected.done': 'Measurement from {date} · {time} deleted.',
      'clear.confirm': 'Delete all saved measurements from this app? This action cannot be undone.',
      'clear.done': 'Local measurements deleted.',

      // Units
      'unit.years': 'years',

      // Metric display labels (mapped from German Beurer CSV keys)
      'metric.kg': 'Weight',
      'metric.BMI': 'Body mass index',
      'metric.Körperfett': 'Body fat',
      'metric.Wasser': 'Body water',
      'metric.Muskeln': 'Muscle percentage',
      'metric.Puls': 'Resting heart rate',
      'metric.Puls.short': 'Pulse',
      'metric.Grundumsatz': 'Basal metabolic rate',
      'metric.Grundumsatz.short': 'Basal metabolic rate (BMR)',
      'metric.Leistungsumsatz': 'Active metabolic rate',
      'metric.Leistungsumsatz.short': 'Active metabolic rate (AMR)',
      'metric.Knochen': 'Bone mass',
      'metric.Metabolisches Alter': 'Metabolic age',
      'metric.Viszeralfett': 'Visceral fat',
      'metric.Soft Lean Mass': 'Soft Lean Mass',
      'metric.Lean Body Mass': 'Lean Body Mass',
      'metric.Protein': 'Protein',
      'metric.Muskelmasse inkl. Organmuskeln': 'Muscle mass incl. organ muscle',
      'metric.Körperfett - Viszeral': 'Body fat - Visceral',
      'metric.Körperfett - Linker Arm': 'Body fat - Left arm',
      'metric.Muskel - Linker Arm': 'Muscle - Left arm',
      'metric.Körperfett - Rechter Arm': 'Body fat - Right arm',
      'metric.Muskel - Rechter Arm': 'Muscle - Right arm',
      'metric.Körperfett - Linkes Bein': 'Body fat - Left leg',
      'metric.Muskel - Linkes Bein': 'Muscle - Left leg',
      'metric.Körperfett - Rechtes Bein': 'Body fat - Right leg',
      'metric.Muskel - Rechtes Bein': 'Muscle - Right leg',
      'metric.Körperfett - Rumpf': 'Body fat - Trunk',
      'metric.Muskel - Rumpf': 'Muscle - Trunk'
    },

    de: {
      // Page & header
      'page.title': 'AtlasSometria · Body Composition Analytics',
      'header.eyebrow': 'Body Composition Analytics',
      'header.subtitle': 'Deine Körperanalyse. Übersichtlich. Lokal. Ohne Benutzerkonto.',
      'actions.importCsv': '＋ CSV importieren',
      'actions.importCsvAria': 'CSV-Datei auswählen',
      'actions.readScreenshot': '▧ Screenshot auslesen',
      'actions.readScreenshotAria': 'Screenshot auswählen',
      'actions.installApp': '↓ App installieren',
      'actions.installAppIos': '＋ Zum Home-Bildschirm',
      'theme.label': 'Farbschema',
      'theme.aria': 'Farbschema wählen',
      'theme.dark': 'Nachtblau (Standard)',
      'theme.ivory': 'Elfenbein',
      'theme.latte': 'Café Latte',
      'theme.neon': 'Neon',
      'lang.label': 'Language / Sprache',

      // Comparison baseline selector
      'compare.label': 'Karten vergleichen mit',
      'compare.aria': 'Vergleichszeitpunkt',
      'compare.prev': 'Vorherige Messung',
      'compare.7d': 'Vor ca. 7 Tagen',
      'compare.30d': 'Vor ca. 30 Tagen',
      'compare.90d': 'Vor ca. 90 Tagen',
      'compare.first': 'Erste Messung',

      // Section headings
      'status.sectionAria': 'Weitere Messwerte und Trends',
      'trends.title': 'Entwicklung',
      'trends.subtitle': 'Verläufe aus deinen importierten Messungen',
      'trends.metricAria': 'Diagrammwert',
      'trends.rangeAria': 'Zeitraum',
      'trends.rangeAll': 'Alle Daten',
      'trends.range30': '30 Tage',
      'trends.range90': '90 Tage',
      'trends.range365': '1 Jahr',
      'trends.dateAria': 'Aktuelle Messung',
      'trends.chartAria': 'Zeitverlaufsdiagramm',
      'trends.ma7': '7-Tage-Schnitt',
      'composition.label': 'Körperzusammensetzung',
      'composition.note': 'Prozentwerte sind unterschiedliche Kennzahlen und ergeben zusammen nicht 100 %.',

      'segments.title': 'Segmentanalyse',
      'segments.subtitle': 'Sechs Messbereiche in vier Karten: Arme und Beine links/rechts mit Differenzen',
      'segments.label': 'Arme und Beine: links, rechts und Differenz auf einen Blick',
      'segments.note': 'Balken zeigen Prozentwerte auf einer 0–100-%-Skala, keine medizinischen Referenzbereiche. Weitere Kennzahlen stehen unter „Weitere Messwerte“.',
      'segments.leftRight': 'Links & rechts',
      'segments.left': 'Links',
      'segments.right': 'Rechts',
      'segments.diffLR': 'Differenz L − R',
      'segments.selected': '✓ Ausgewählt',
      'segments.tapHint': 'Antippen für Details',
      'segments.noComplete': 'Keine vollständigen Werte',
      'segments.equal': 'Beide Seiten gleich',
      'segments.sideHigher': '{side} um {diff} PP höher',
      'segments.ppUnit': 'PP',
      'segments.summary': 'Die beiden Seiten und ihre Differenzen stehen zusammen in der jeweiligen Karte. PP = Prozentpunkte; Differenz = links minus rechts.',
      'segments.visceralIndex': 'Viszeralfett-Index',
      'segments.visceralNote': 'Indexwert ohne Muskelanteil.',

      // Segment area display names
      'segment.Arme': 'Arme',
      'segment.Beine': 'Beine',
      'segment.Rumpf': 'Rumpf',
      'segment.Viszeral': 'Viszeral',

      // Additional measurements
      'other.title': 'Weitere Messwerte',
      'other.subtitle': 'Alle übrigen Angaben auf einen Blick',
      'other.metabolism': 'Stoffwechsel und Herzfrequenz',
      'other.bodyMass': 'Körpermasse',

      // Data management & footer
      'manage.title': 'Import & Datenverwaltung',
      'manage.subtitle': 'Du behältst die Kontrolle über deine Messungen',
      'manage.manualBtn': '＋ Kalorienwerte manuell ergänzen',
      'manage.exportBtn': '↓ Ergänzte CSV exportieren',
      'manage.deleteSelectedBtn': 'Ausgewählte Messung löschen',
      'manage.clearBtn': 'Alle lokalen Daten löschen',
      'manage.notice': 'Die Beurer-CSV enthält Grundumsatz und Leistungsumsatz möglicherweise nicht. Diese zwei Werte lassen sich aus einem Screenshot auslesen und anschließend der Messung zuordnen. Die OCR-Bibliothek wird bei Bedarf aus dem Internet geladen; das Bild selbst wird im Browser verarbeitet und nicht an einen Server dieser App gesendet.',
      'footer.text': 'AtlasSometria · Private lokale Web-App · Messwerte sind Schätzungen des Messgeräts, keine Diagnose. Daten werden ausschließlich im Browser gespeichert (sofern lokaler Speicher aktiviert ist). Beim Löschen der Browserdaten können sie verloren gehen; regelmäßig ergänzte CSV-Backups exportieren.',

      // Modal
      'modal.title': 'Kalorienwerte ergänzen',
      'modal.closeAria': 'Schließen',
      'modal.desc': 'Werte werden erst nach Bestätigung gespeichert. Bei mehreren Messungen bitte das richtige Datum auswählen.',
      'modal.previewAlt': 'Ausgewählter Screenshot',
      'modal.measurement': 'Messung',
      'modal.bmrLabel': 'Grundumsatz (kcal)',
      'modal.amrLabel': 'Leistungsumsatz (kcal)',
      'modal.kcalPlaceholder': 'kcal eingeben',
      'modal.apply': 'Werte übernehmen',
      'modal.cancel': 'Abbrechen',

      // iOS install guide modal
      'install.iosTitle': 'AtlasSometria zum Home-Bildschirm',
      'install.iosIntro': 'Speichere AtlasSometria auf deinem iPhone oder iPad für schnellen Vollbild-Start:',
      'install.iosStep1': 'Tippe in der Safari-Leiste auf das Teilen-Symbol.',
      'install.iosStep2': 'Scrolle nach unten und wähle „Zum Home-Bildschirm“.',
      'install.iosStep3': 'Bestätige oben rechts mit „Hinzufügen“.',
      'install.done': 'Verstanden',
      'install.installedToast': 'AtlasSometria wurde installiert.',

      // Dynamic dashboard states
      'empty.state': 'Keine Messungen vorhanden. Importiere eine Beurer-CSV.',
      'delta.none': 'Noch kein Vergleich',
      'delta.same': '→ Unverändert zur vorherigen Messung',
      'delta.up': '↑ +{diff}{unit} zur vorherigen Messung',
      'delta.down': '↓ −{diff}{unit} zur vorherigen Messung',
      'delta.sameDate': '→ Unverändert zu {date}',
      'delta.upDate': '↑ +{diff}{unit} zu {date}',
      'delta.downDate': '↓ −{diff}{unit} zu {date}',
      'spark.minTwo': 'Verlauf ab 2 Messungen',
      'spark.aria': 'Verlauf der letzten {count} Messungen',

      // Chart notes & tooltips
      'chart.single': 'Bisher eine Messung – für einen Verlauf weitere CSV-Dateien importieren.',
      'chart.points': '{count} Messpunkte · {metric} · Punkte für Details antippen',
      'chart.pointsInRange': '{count} von {total} Messpunkten · {metric} · Punkte für Details antippen',
      'chart.noValues': 'Keine Werte für diese Kennzahl.',
      'chart.noValuesInRange': 'Keine Werte in diesem Zeitraum.',
      'chart.noData': 'Noch keine Diagrammdaten',
      'chart.legendValue': 'Messwert',
      'chart.legendMa7': '7-Tage-Schnitt',
      'chart.tooltipMa7': '7-T-Schnitt: {value}{unit}',

      // Storage & backup reminder
      'storage.saved': '{count} Messung(en) lokal gespeichert.',
      'storage.unavailable': 'Lokaler Speicher nicht verfügbar. Bitte ergänzte CSV exportieren.',
      'storage.summary': '{total} Messung(en) im Dashboard · {withKcal} mit beiden Kalorienwerten',
      'backup.never': 'Erinnerung: Du hast {count} lokale Messungen und noch kein CSV-Backup exportiert.',
      'backup.old': 'Erinnerung: Dein letztes CSV-Backup ist {days} Tage her ({changes} Änderung(en) seitdem).',
      'backup.changes': 'Erinnerung: {changes} Änderung(en) seit deinem letzten CSV-Backup.',
      'backup.exportNow': 'Backup jetzt exportieren',

      // Import / Export / Clear messages
      'import.readingTitle': 'CSV wird eingelesen …',
      'import.readingDetail': 'Datei: {file}',
      'import.doneTitle': 'CSV erfolgreich verarbeitet',
      'import.doneSame': '{added} neue Messung(en), {updated} bereits vorhandene Messung(en). Die Messwerte waren schon vorhanden – deshalb bleiben die Diagramme unverändert.',
      'import.doneChanged': '{added} neue Messung(en), {updated} bereits vorhandene Messung(en). Aktualisierte Werte werden jetzt im Dashboard angezeigt.',
      'import.doneRange': 'Importierter Zeitraum: {from} – {to}',
      'import.doneTotal': 'Insgesamt {total} Messung(en). Ein Zeitverlauf entsteht ab zwei unterschiedlichen Messzeitpunkten.',
      'import.toastDone': 'CSV-Import abgeschlossen.',
      'import.failTitle': 'CSV-Import fehlgeschlagen',
      'import.failAlert': 'Import fehlgeschlagen: {message}',
      'error.noBeurerTable': 'Keine Beurer-Gewichtstabelle (Datum;Uhrzeit;...) gefunden.',
      'error.noValidRows': 'Keine gültigen Gewichtsmessungen gefunden.',

      // Calorie edit & OCR
      'edit.needCsv': 'Bitte zunächst eine Beurer-CSV importieren.',
      'edit.scanPrompt': 'Screenshot auswählen. Anschließend wird versucht, die Kalorienwerte automatisch zu lesen.',
      'edit.manualPrompt': 'Werte eintragen oder vorhandene Werte bearbeiten.',
      'edit.invalidKcal': 'Bitte plausible Kalorienwerte eingeben.',
      'edit.noSelection': 'Keine Messung ausgewählt.',
      'edit.savedToast': 'Kalorienwerte der Messung gespeichert.',
      'edit.savedTitle': 'Kalorienwerte übernommen',
      'edit.savedDetail': 'Grundumsatz: {bmr} kcal · Leistungsumsatz: {amr} kcal. Sie erscheinen unter „Weitere Messwerte“.',

      'ocr.selectedTitle': 'Screenshot ausgewählt',
      'ocr.selectedDetail': 'Bild: {file}. Die erkannten Kalorienwerte erscheinen zunächst im Bestätigungsfenster und werden nicht automatisch gespeichert.',
      'ocr.running': 'Texterkennung läuft lokal im Browser. Die benötigten Sprachmodelle werden gegebenenfalls heruntergeladen.',
      'ocr.progress': 'Texterkennung: {percent} %',
      'ocr.loadError': 'Texterkennung konnte nicht geladen werden. Internetverbindung prüfen.',
      'ocr.foundModal': '{count} von 2 Kalorienwerten erkannt. Bitte kontrollieren und mit „Werte übernehmen“ speichern.',
      'ocr.noneModal': 'Keine eindeutigen Kalorienwerte erkannt. Bitte Werte manuell aus dem Screenshot eintragen.',
      'ocr.doneTitle': 'Screenshot-Erkennung abgeschlossen',
      'ocr.doneFound': '{count} von 2 Kalorienwerten erkannt. Bitte im geöffneten Fenster prüfen und „Werte übernehmen“ wählen.',
      'ocr.doneNone': '0 von 2 Kalorienwerten erkannt. Die Werte müssen im geöffneten Fenster manuell eingetragen werden.',
      'ocr.failModal': 'Automatische Erkennung fehlgeschlagen: {message} Werte können weiterhin manuell eingetragen werden.',
      'ocr.failTitle': 'Screenshot-Texterkennung nicht verfügbar',
      'ocr.failDetail': '{message} Bitte die Werte im geöffneten Fenster manuell eintragen und „Werte übernehmen“ wählen.',

      // Export, single delete & clear
      'export.empty': 'Keine Daten zum Exportieren.',
      'export.done': 'Ergänzte CSV erstellt.',
      'deleteSelected.empty': 'Keine Messung zum Löschen ausgewählt.',
      'deleteSelected.confirm': 'Messung vom {date} · {time} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      'deleteSelected.done': 'Messung vom {date} · {time} gelöscht.',
      'clear.confirm': 'Alle gespeicherten Messungen aus dieser App löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      'clear.done': 'Lokale Messdaten gelöscht.',

      // Units
      'unit.years': 'Jahre',

      // Metric display labels (mapped from German Beurer CSV keys)
      'metric.kg': 'Gewicht',
      'metric.BMI': 'Body-Mass-Index',
      'metric.Körperfett': 'Körperfett',
      'metric.Wasser': 'Körperwasser',
      'metric.Muskeln': 'Muskelanteil',
      'metric.Puls': 'Ruhepuls',
      'metric.Puls.short': 'Puls',
      'metric.Grundumsatz': 'Grundumsatz',
      'metric.Grundumsatz.short': 'Grundumsatz (BMR)',
      'metric.Leistungsumsatz': 'Leistungsumsatz',
      'metric.Leistungsumsatz.short': 'Leistungsumsatz (AMR)',
      'metric.Knochen': 'Knochenmasse',
      'metric.Metabolisches Alter': 'Metabolisches Alter',
      'metric.Viszeralfett': 'Viszeralfett',
      'metric.Soft Lean Mass': 'Soft Lean Mass',
      'metric.Lean Body Mass': 'Lean Body Mass',
      'metric.Protein': 'Protein',
      'metric.Muskelmasse inkl. Organmuskeln': 'Muskelmasse inkl. Organmuskeln',
      'metric.Körperfett - Viszeral': 'Körperfett - Viszeral',
      'metric.Körperfett - Linker Arm': 'Körperfett - Linker Arm',
      'metric.Muskel - Linker Arm': 'Muskel - Linker Arm',
      'metric.Körperfett - Rechter Arm': 'Körperfett - Rechter Arm',
      'metric.Muskel - Rechter Arm': 'Muskel - Rechter Arm',
      'metric.Körperfett - Linkes Bein': 'Körperfett - Linkes Bein',
      'metric.Muskel - Linkes Bein': 'Muskel - Linkes Bein',
      'metric.Körperfett - Rechtes Bein': 'Körperfett - Rechtes Bein',
      'metric.Muskel - Rechtes Bein': 'Muskel - Rechtes Bein',
      'metric.Körperfett - Rumpf': 'Körperfett - Rumpf',
      'metric.Muskel - Rumpf': 'Muskel - Rumpf'
    }
  };

  let currentLang = 'en';
  try {
    currentLang = localStorage.getItem(LANG_STORAGE_KEY) === 'de' ? 'de' : 'en';
  } catch {
    currentLang = 'en';
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    currentLang = lang === 'de' ? 'de' : 'en';
    document.documentElement.lang = currentLang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    } catch {
      // Ignore unavailable storage (e.g. private browsing)
    }
    return currentLang;
  }

  function getLocale() {
    return currentLang === 'de' ? 'de-AT' : 'en-US';
  }

  function t(key, vars) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    const template = Object.prototype.hasOwnProperty.call(dict, key)
      ? dict[key]
      : (Object.prototype.hasOwnProperty.call(TRANSLATIONS.en, key) ? TRANSLATIONS.en[key] : key);
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, function replaceVar(_, name) {
      return vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : '';
    });
  }

  function metricLabel(csvKey) {
    const lookupKey = 'metric.' + csvKey;
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    if (Object.prototype.hasOwnProperty.call(dict, lookupKey)) {
      return dict[lookupKey];
    }
    if (Object.prototype.hasOwnProperty.call(TRANSLATIONS.en, lookupKey)) {
      return TRANSLATIONS.en[lookupKey];
    }
    return csvKey;
  }

  function applyStaticTranslations(root) {
    const scope = root || document;
    document.title = t('page.title');

    scope.querySelectorAll('[data-i18n]').forEach(function updateText(el) {
      el.textContent = t(el.dataset.i18n);
    });

    scope.querySelectorAll('[data-i18n-aria-label]').forEach(function updateAria(el) {
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });

    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function updatePlaceholder(el) {
      el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });

    scope.querySelectorAll('[data-i18n-alt]').forEach(function updateAlt(el) {
      el.setAttribute('alt', t(el.dataset.i18nAlt));
    });
  }

  global.AtlasI18n = {
    LANG_STORAGE_KEY: LANG_STORAGE_KEY,
    getLang: getLang,
    setLang: setLang,
    getLocale: getLocale,
    t: t,
    metricLabel: metricLabel,
    applyStaticTranslations: applyStaticTranslations
  };
})(window);
