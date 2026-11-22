'use strict';

/**
 * AtlasSometria — Body Composition Analytics
 * Static browser-based dashboard for Beurer HealthManager Pro CSV exports.
 * Works offline via file:// and on GitHub Pages without a build system.
 *
 * Storage compatibility:
 * - Measurements: localStorage['atlassometria-local-v1']
 * - Theme:        localStorage['atlassometria-theme-v1']
 * - Language:     localStorage['atlassometria-language-v1']
 * - Backup meta:  localStorage['atlassometria-backup-meta-v1'] (additive reminder metadata)
 *
 * German Beurer CSV keys (Datum, Uhrzeit, Körperfett, etc.) are preserved
 * unchanged internally regardless of UI language.
 */
(function initAtlasSometria() {
  const I18N = window.AtlasI18n;
  const t = I18N.t;

  const STORAGE_KEY = 'atlassometria-local-v1';
  const THEME_KEY = 'atlassometria-theme-v1';
  const BACKUP_META_KEY = 'atlassometria-backup-meta-v1';
  const THEME_NAMES = ['dark', 'ivory', 'latte', 'neon'];
  const DAY_MS = 86400000;

  // Internal German Beurer CSV metric keys (never translated internally).
  const METRICS = [
    'kg',
    'BMI',
    'Körperfett',
    'Wasser',
    'Muskeln',
    'Puls',
    'Grundumsatz',
    'Leistungsumsatz',
    'Knochen',
    'Metabolisches Alter',
    'Viszeralfett',
    'Soft Lean Mass',
    'Lean Body Mass',
    'Protein',
    'Muskelmasse inkl. Organmuskeln',
    'Körperfett - Viszeral',
    ...['Linker Arm', 'Rechter Arm', 'Linkes Bein', 'Rechtes Bein', 'Rumpf'].flatMap(
      (part) => ['Körperfett - ' + part, 'Muskel - ' + part]
    )
  ];

  // Local inline SVG icons (no external resources).
  const ICON_PATHS = {
    weight:
      '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8a3 3 0 0 1 6 0M12 8l1.5-1.5"/>',
    fat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',
    muscle:
      '<path d="M4 14c1-4 3-3 5-1l2-3-1-3 3-2 3 2-1 4 4 1 2 4-3 4H8l-4-6Z"/>',
    bmi: '<path d="M4 19V5M4 19h16M8 15l4-4 3 2 4-7"/>',
    water:
      '<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/><path d="M8 16c0 2 2 4 4 4"/>',
    pulse: '<path d="M3 12h4l3-6 4 12 3-6h4"/>',
    calories:
      '<path d="M12 22c5 0 8-4 8-8 0-4-3-6-4-7 0 3-2 4-2 4 0-4-2-6-4-9 0 4-1 6-3 8-2 2-3 4-3 6 0 4 3 6 8 6Z"/>'
  };

  let rows = [];
  let selected = 0;
  let selectedSegment = 'Arme';
  let compareMode = 'prev';
  let chartRange = 'all';
  let showMovingAvg = false;
  let lastChartPoints = [];
  let activeChartPointIdx = null;
  let activePreviewUrl = null;
  let storageUnavailable = false;
  let lastResultState = null;
  let lastOcrStatusState = null;
  let toastTimer = null;
  let deferredInstallPrompt = null;
  let isInstalledPwa = false;
  let isIosBrowser = false;

  const $ = (id) => document.getElementById(id);

  // --- Parsing & formatting helpers ---

  function parseNumber(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    let s = String(raw).trim().replace(/\s/g, '');
    if (s.includes(',') && s.includes('.')) {
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        s = s.replace(/,/g, '');
      }
    } else {
      s = s.replace(',', '.');
    }
    const v = Number(s);
    return Number.isFinite(v) ? v : null;
  }

  /**
   * Dedicated calorie parser for manual entry & OCR.
   * Properly interprets thousands separators like "1.850" or "1,850" kcal as 1850
   * instead of 1.85.
   */
  function parseKcal(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    let s = String(raw).trim().replace(/\s/g, '');
    if (/^\d{1,2}[.,]\d{3}$/.test(s)) {
      s = s.replace(/[.,]/g, '');
    }
    return parseNumber(s);
  }

  function fmt(n, digits = 1) {
    if (n === null || n === undefined || !Number.isFinite(n)) return '–';
    return n.toLocaleString(I18N.getLocale(), { maximumFractionDigits: digits });
  }

  function fmtCsvDecimal(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number' && Number.isFinite(v)) {
      return String(v).replace('.', ',');
    }
    return String(v);
  }

  function rowKey(r) {
    return r.date + '|' + r.time;
  }

  function rowTimestamp(r) {
    const p = r.date.split('.');
    const hm = (r.time || '00:00').split(':').map(Number);
    return new Date(+p[2], +p[1] - 1, +p[0], hm[0] || 0, hm[1] || 0).getTime();
  }

  function unit(csvKey) {
    if (
      csvKey === 'kg' ||
      csvKey === 'Knochen' ||
      [
        'Protein',
        'Soft Lean Mass',
        'Lean Body Mass',
        'Muskelmasse inkl. Organmuskeln'
      ].includes(csvKey)
    ) {
      return 'kg';
    }
    if (csvKey === 'BMI') return '';
    if (csvKey === 'Puls') return 'bpm';
    if (csvKey === 'Metabolisches Alter') return t('unit.years');
    if (csvKey === 'Grundumsatz' || csvKey === 'Leistungsumsatz') return 'kcal';
    if (csvKey === 'Viszeralfett' || csvKey.includes('Viszeral')) return '';
    return '%';
  }

  function getValue(r, csvKey) {
    return r && r.values && r.values[csvKey] !== undefined ? r.values[csvKey] : null;
  }

  function icon(name) {
    return (
      '<svg aria-hidden="true" viewBox="0 0 24 24">' +
      (ICON_PATHS[name] || ICON_PATHS.bmi) +
      '</svg>'
    );
  }

  // --- Backup reminder metadata (additive, never touches measurement records) ---

  function loadBackupMeta() {
    try {
      const raw = localStorage.getItem(BACKUP_META_KEY);
      if (!raw) return { lastExportAt: null, changesSinceExport: 0 };
      const parsed = JSON.parse(raw);
      return {
        lastExportAt: typeof parsed.lastExportAt === 'number' ? parsed.lastExportAt : null,
        changesSinceExport:
          typeof parsed.changesSinceExport === 'number' ? parsed.changesSinceExport : 0
      };
    } catch {
      return { lastExportAt: null, changesSinceExport: 0 };
    }
  }

  function saveBackupMeta(meta) {
    try {
      localStorage.setItem(BACKUP_META_KEY, JSON.stringify(meta));
    } catch {
      // Ignore unavailable storage
    }
  }

  function recordDataChange(count) {
    const meta = loadBackupMeta();
    meta.changesSinceExport = (meta.changesSinceExport || 0) + Math.max(1, count || 1);
    saveBackupMeta(meta);
    renderBackupReminder();
  }

  function recordBackupExported() {
    saveBackupMeta({ lastExportAt: Date.now(), changesSinceExport: 0 });
    renderBackupReminder();
  }

  function renderBackupReminder() {
    const el = $('backupReminder');
    if (!el) return;
    if (!rows.length) {
      el.hidden = true;
      el.textContent = '';
      return;
    }

    const meta = loadBackupMeta();
    const now = Date.now();
    const daysSinceExport =
      meta.lastExportAt !== null ? Math.floor((now - meta.lastExportAt) / DAY_MS) : null;

    let message = '';
    if (meta.lastExportAt === null && rows.length >= 3) {
      message = t('backup.never', { count: rows.length });
    } else if (daysSinceExport !== null && daysSinceExport >= 30) {
      message = t('backup.old', {
        days: daysSinceExport,
        changes: meta.changesSinceExport || 0
      });
    } else if (meta.changesSinceExport >= 10) {
      message = t('backup.changes', { changes: meta.changesSinceExport });
    }

    if (!message) {
      el.hidden = true;
      el.textContent = '';
      return;
    }

    el.hidden = false;
    el.textContent = '';

    const span = document.createElement('span');
    span.textContent = message;
    el.appendChild(span);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = t('backup.exportNow');
    btn.addEventListener('click', exportEnrichedCsv);
    el.appendChild(btn);
  }

  // --- UI feedback helpers ---

  function showResult(titleKey, lines) {
    lastResultState = { titleKey: titleKey, lines: lines };
    renderResultBanner();
    const el = $('importResult');
    if (el && !el.hidden) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function renderResultBanner() {
    const el = $('importResult');
    if (!el || !lastResultState) return;
    el.hidden = false;
    el.textContent = '';

    const strong = document.createElement('strong');
    strong.textContent = t(lastResultState.titleKey);
    el.appendChild(strong);

    const detailBox = document.createElement('div');
    lastResultState.lines.forEach((line, index) => {
      if (index > 0) detailBox.appendChild(document.createElement('br'));
      const text = typeof line === 'string' ? line : t(line.key, line.vars);
      detailBox.appendChild(document.createTextNode(text));
    });
    el.appendChild(detailBox);
  }

  function setOcrStatus(key, vars) {
    lastOcrStatusState = { key: key, vars: vars || null };
    const el = $('ocrStatus');
    if (el) el.textContent = t(key, vars);
  }

  function toast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.display = 'none';
    }, 4200);
  }

  // --- Local storage ---

  function updateDataStatus() {
    const el = $('dataStatus');
    if (!el) return;
    if (storageUnavailable) {
      el.textContent = t('storage.unavailable');
      return;
    }
    if (!rows.length) {
      el.textContent = t('storage.saved', { count: 0 });
      return;
    }
    const withKcal = rows.filter(
      (r) => getValue(r, 'Grundumsatz') !== null && getValue(r, 'Leistungsumsatz') !== null
    ).length;
    el.textContent = t('storage.summary', {
      total: rows.length,
      withKcal: withKcal
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      storageUnavailable = false;
      $('dataStatus').textContent = t('storage.saved', { count: rows.length });
    } catch {
      storageUnavailable = true;
      $('dataStatus').textContent = t('storage.unavailable');
    }
  }

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      rows = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(rows)) rows = [];
    } catch {
      rows = [];
    }
    rows.sort((a, b) => rowTimestamp(a) - rowTimestamp(b));
    selected = Math.max(0, rows.length - 1);
  }

  // --- Metric selectors & analytics ---

  function populateMetricSelect() {
    const select = $('metricSelect');
    if (!select) return;
    const prev = select.value || 'kg';
    select.textContent = '';
    METRICS.forEach((csvKey) => {
      const opt = document.createElement('option');
      opt.value = csvKey;
      opt.textContent = I18N.metricLabel(csvKey);
      select.appendChild(opt);
    });
    select.value = METRICS.includes(prev) ? prev : 'kg';
  }

  function findComparisonRow(index, csvKey, mode) {
    if (index <= 0 || !rows[index]) return null;

    if (mode === 'prev') {
      for (let i = index - 1; i >= 0; i--) {
        const v = getValue(rows[i], csvKey);
        if (v !== null && Number.isFinite(v)) return rows[i];
      }
      return null;
    }

    if (mode === 'first') {
      for (let i = 0; i < index; i++) {
        const v = getValue(rows[i], csvKey);
        if (v !== null && Number.isFinite(v)) return rows[i];
      }
      return null;
    }

    const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[mode];
    if (!days) return findComparisonRow(index, csvKey, 'prev');

    const targetTs = rowTimestamp(rows[index]) - days * DAY_MS;
    let bestRow = null;
    let bestDist = Infinity;

    for (let i = 0; i < index; i++) {
      const v = getValue(rows[i], csvKey);
      if (v === null || !Number.isFinite(v)) continue;
      const dist = Math.abs(rowTimestamp(rows[i]) - targetTs);
      if (dist < bestDist) {
        bestDist = dist;
        bestRow = rows[i];
      }
    }
    return bestRow;
  }

  function deltaInfo(index, csvKey) {
    const current = getValue(rows[index], csvKey);
    const baselineRow = findComparisonRow(index, csvKey, compareMode);
    const previous = baselineRow ? getValue(baselineRow, csvKey) : null;

    if (current === null || previous === null) {
      return { cls: '', label: t('delta.none') };
    }

    const diff = current - previous;
    const isPrev = compareMode === 'prev';
    if (Math.abs(diff) < 0.000001) {
      return {
        cls: 'same',
        label: isPrev ? t('delta.same') : t('delta.sameDate', { date: baselineRow.date })
      };
    }

    const u = unit(csvKey);
    const unitSuffix = u ? ' ' + u : '';
    const key = isPrev
      ? diff > 0
        ? 'delta.up'
        : 'delta.down'
      : diff > 0
        ? 'delta.upDate'
        : 'delta.downDate';

    return {
      cls: diff > 0 ? 'up' : 'down',
      label: t(key, {
        diff: fmt(Math.abs(diff)),
        unit: unitSuffix,
        date: baselineRow.date
      })
    };
  }

  function computeMovingAverage(pts) {
    // True 7-day rolling window (current day + preceding 6 days)
    const windowMs = 6 * DAY_MS;
    return pts.map((pt, i) => {
      let sum = 0;
      let count = 0;
      for (let j = i; j >= 0; j--) {
        if (pt.x - pts[j].x > windowMs) break;
        sum += pts[j].y;
        count++;
      }
      return count > 0 ? sum / count : pt.y;
    });
  }

  function sparkline(csvKey, index) {
    const vals = rows
      .slice(0, index + 1)
      .map((r) => getValue(r, csvKey))
      .filter((v) => v !== null && Number.isFinite(v))
      .slice(-12);

    if (vals.length < 2) {
      return '<div class="trend-context">' + t('spark.minTwo') + '</div>';
    }

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const xy = vals.map((v, i) => [
      5 + (i / (vals.length - 1)) * 190,
      30 - ((v - min) / range) * 23
    ]);
    const path = xy
      .map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1))
      .join(' ');
    const end = xy[xy.length - 1];
    const ariaLabel = t('spark.aria', { count: vals.length });

    return (
      '<svg class="metric-spark" viewBox="0 0 200 35" preserveAspectRatio="none" role="img" aria-label="' +
      ariaLabel +
      '"><path class="line-spark" d="' +
      path +
      '"/><circle cx="' +
      end[0].toFixed(1) +
      '" cy="' +
      end[1].toFixed(1) +
      '" r="3.2" fill="currentColor"/></svg>'
    );
  }

  function renderStatus(index) {
    const r = rows[index];
    const specs = [
      ['Wasser', I18N.metricLabel('Wasser'), 'water'],
      ['Puls', t('metric.Puls.short'), 'pulse'],
      ['Grundumsatz', I18N.metricLabel('Grundumsatz'), 'calories']
    ];

    $('statusTiles').innerHTML = specs
      .map(([csvKey, label, sym]) => {
        const d = deltaInfo(index, csvKey);
        const v = getValue(r, csvKey);
        return (
          '<article class="status-tile">' +
          '<div class="status-title"><span class="status-icon">' +
          icon(sym) +
          '</span>' +
          label +
          '</div>' +
          '<div class="status-value">' +
          fmt(v) +
          ' <small>' +
          unit(csvKey) +
          '</small></div>' +
          '<div class="status-sub">' +
          d.label +
          '</div>' +
          sparkline(csvKey, index) +
          '</article>'
        );
      })
      .join('');
  }

  function renderSegmentComparison() {
    const s = $('segmentCompare');
    if (selectedSegment === 'Arme' || selectedSegment === 'Beine') {
      s.innerHTML = '<p class="segment-summary">' + t('segments.summary') + '</p>';
    } else {
      s.innerHTML = '';
    }
  }

  function render() {
    const compareBar = $('compareBar');
    if (compareBar) {
      compareBar.hidden = rows.length < 2;
    }

    const delBtn = $('deleteSelectedBtn');
    if (delBtn) {
      delBtn.disabled = !rows.length;
    }

    if (!rows.length) {
      $('statusTiles').innerHTML = '';
      $('cards').innerHTML =
        '<div class="panel empty" style="grid-column:1/-1">' + t('empty.state') + '</div>';
      ['bars', 'segments', 'segmentCompare', 'otherA', 'otherB'].forEach((id) => {
        $(id).innerHTML = '';
      });
      $('dateSelect').innerHTML = '';
      updateDataStatus();
      renderBackupReminder();
      activeChartPointIdx = null;
      draw();
      return;
    }

    selected = Math.min(Math.max(selected, 0), rows.length - 1);
    const r = rows[selected];

    $('dateSelect').innerHTML = rows
      .map(
        (v, i) =>
          '<option value="' +
          i +
          '" ' +
          (i === selected ? 'selected' : '') +
          '>' +
          v.date +
          ' · ' +
          v.time +
          '</option>'
      )
      .join('');

    const summarySpecs = [
      ['kg', I18N.metricLabel('kg'), 'weight'],
      ['Körperfett', I18N.metricLabel('Körperfett'), 'fat'],
      ['Muskeln', I18N.metricLabel('Muskeln'), 'muscle'],
      ['BMI', I18N.metricLabel('BMI'), 'bmi']
    ];

    $('cards').innerHTML = summarySpecs
      .map(([csvKey, label, sym]) => {
        const d = deltaInfo(selected, csvKey);
        return (
          '<article class="panel metric">' +
          '<div class="accent"></div>' +
          '<div class="metric-topline"><small>' +
          label +
          '</small><span class="metric-icon">' +
          icon(sym) +
          '</span></div>' +
          '<div class="value">' +
          fmt(getValue(r, csvKey)) +
          '<span class="unit">' +
          unit(csvKey) +
          '</span></div>' +
          '<div class="metric-trend ' +
          d.cls +
          '">' +
          d.label +
          '</div>' +
          sparkline(csvKey, selected) +
          '<div class="foot">' +
          r.date +
          ' · ' +
          r.time +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    renderStatus(selected);

    $('bars').innerHTML = ['Körperfett', 'Wasser', 'Muskeln']
      .map((csvKey) => {
        const val = getValue(r, csvKey);
        const pct = Math.min(100, Math.max(0, val || 0));
        return (
          '<div class="barline">' +
          '<label>' +
          I18N.metricLabel(csvKey) +
          '</label>' +
          '<div class="bartrack"><div class="barfill" style="width:' +
          pct +
          '%"></div></div>' +
          '<span>' +
          fmt(val) +
          ' %</span>' +
          '</div>'
        );
      })
      .join('');

    const pp = t('segments.ppUnit');

    const segMetric = (prefix, leftKey, rightKey, label) => {
      const a = getValue(r, prefix + ' - ' + leftKey);
      const b = getValue(r, prefix + ' - ' + rightKey);
      const delta = a === null || b === null ? null : a - b;
      const diff =
        delta === null ? '–' : (delta > 0 ? '+' : '') + fmt(delta) + ' ' + pp;
      const direction =
        delta === null
          ? t('segments.noComplete')
          : Math.abs(delta) < 0.00001
            ? t('segments.equal')
            : t('segments.sideHigher', {
                side: delta > 0 ? t('segments.left') : t('segments.right'),
                diff: fmt(Math.abs(delta))
              });

      return (
        '<div class="paired-metric">' +
        '<div class="paired-label">' +
        label +
        '</div>' +
        '<div class="paired-values">' +
        '<div><small>' +
        t('segments.left') +
        '</small><strong>' +
        fmt(a) +
        ' %</strong></div>' +
        '<div><small>' +
        t('segments.right') +
        '</small><strong>' +
        fmt(b) +
        ' %</strong></div>' +
        '<div class="paired-diff"><small>' +
        t('segments.diffLR') +
        '</small><strong>' +
        diff +
        '</strong></div>' +
        '</div>' +
        '<p class="paired-note">' +
        direction +
        '</p>' +
        '</div>'
      );
    };

    const pairedCard = (segmentId, leftKey, rightKey) => {
      const isSelected = selectedSegment === segmentId;
      return (
        '<article class="segment-card paired-card ' +
        (isSelected ? 'is-selected' : '') +
        '" role="button" tabindex="0" data-segment="' +
        segmentId +
        '" aria-pressed="' +
        isSelected +
        '">' +
        '<h3>' +
        t('segment.' + segmentId) +
        ' <span class="card-subheading">' +
        t('segments.leftRight') +
        '</span></h3>' +
        segMetric('Körperfett', leftKey, rightKey, I18N.metricLabel('Körperfett')) +
        segMetric('Muskel', leftKey, rightKey, I18N.metricLabel('Muskeln')) +
        '<div class="segment-hint">' +
        (isSelected ? t('segments.selected') : t('segments.tapHint')) +
        '</div>' +
        '</article>'
      );
    };

    const singleCard = (segmentId) => {
      const f = getValue(r, 'Körperfett - ' + segmentId);
      const m = getValue(r, 'Muskel - ' + segmentId);
      const isSelected = selectedSegment === segmentId;
      const track = (v, type) =>
        '<div class="segtrack"><div class="segfill ' +
        type +
        '" style="width:' +
        (v === null ? 0 : Math.min(100, Math.max(0, v))) +
        '%"></div></div>';

      return (
        '<article class="segment-card ' +
        (isSelected ? 'is-selected' : '') +
        '" role="button" tabindex="0" data-segment="' +
        segmentId +
        '" aria-pressed="' +
        isSelected +
        '">' +
        '<h3>' +
        t('segment.' + segmentId) +
        '</h3>' +
        '<div class="segmetric"><div class="segmetric-top"><span>' +
        I18N.metricLabel('Körperfett') +
        '</span><b>' +
        fmt(f) +
        ' %</b></div>' +
        track(f, 'fat') +
        '</div>' +
        '<div class="segmetric"><div class="segmetric-top"><span>' +
        I18N.metricLabel('Muskeln') +
        '</span><b>' +
        fmt(m) +
        ' %</b></div>' +
        track(m, 'muscle') +
        '</div>' +
        '<div class="segment-hint">' +
        (isSelected ? t('segments.selected') : t('segments.tapHint')) +
        '</div>' +
        '</article>'
      );
    };

    const visceralSelected = selectedSegment === 'Viszeral';
    const visceralCard =
      '<article class="segment-card ' +
      (visceralSelected ? 'is-selected' : '') +
      '" role="button" tabindex="0" data-segment="Viszeral" aria-pressed="' +
      visceralSelected +
      '">' +
      '<h3>' +
      t('segment.Viszeral') +
      '</h3>' +
      '<div class="segmetric"><div class="segmetric-top"><span>' +
      t('segments.visceralIndex') +
      '</span><b>' +
      fmt(getValue(r, 'Körperfett - Viszeral')) +
      '</b></div></div>' +
      '<p class="seg-note">' +
      t('segments.visceralNote') +
      '</p>' +
      '<div class="segment-hint">' +
      (visceralSelected ? t('segments.selected') : t('segments.tapHint')) +
      '</div>' +
      '</article>';

    $('segments').innerHTML =
      pairedCard('Arme', 'Linker Arm', 'Rechter Arm') +
      pairedCard('Beine', 'Linkes Bein', 'Rechtes Bein') +
      singleCard('Rumpf') +
      visceralCard;

    renderSegmentComparison();

    const fieldRow = (csvKey, label) => {
      const u = unit(csvKey);
      return (
        '<div class="measure"><span>' +
        (label || I18N.metricLabel(csvKey)) +
        '</span><strong>' +
        fmt(getValue(r, csvKey)) +
        (u ? ' ' + u : '') +
        '</strong></div>'
      );
    };

    $('otherA').innerHTML =
      '<div class="section-label">' +
      t('other.metabolism') +
      '</div>' +
      [
        ['Grundumsatz', t('metric.Grundumsatz.short')],
        ['Leistungsumsatz', t('metric.Leistungsumsatz.short')],
        ['Puls', t('metric.Puls.short')],
        ['Metabolisches Alter', I18N.metricLabel('Metabolisches Alter')],
        ['Viszeralfett', I18N.metricLabel('Viszeralfett')]
      ]
        .map(([k, lbl]) => fieldRow(k, lbl))
        .join('');

    $('otherB').innerHTML =
      '<div class="section-label">' +
      t('other.bodyMass') +
      '</div>' +
      [
        'Knochen',
        'Soft Lean Mass',
        'Lean Body Mass',
        'Protein',
        'Muskelmasse inkl. Organmuskeln'
      ]
        .map((k) => fieldRow(k))
        .join('');

    updateDataStatus();
    renderBackupReminder();
    draw();
  }

  // --- Interactive Canvas trend chart (range filter, 7-day moving average, tap/hover tooltip) ---

  function hideChartTooltip() {
    const tt = $('chartTooltip');
    if (tt) tt.hidden = true;
  }

  function renderChartTooltip(pt, canvasWidth) {
    const tt = $('chartTooltip');
    if (!tt || !pt) {
      hideChartTooltip();
      return;
    }

    tt.textContent = '';
    const dateLine = document.createElement('div');
    dateLine.className = 'tt-sub';
    dateLine.textContent = pt.date + ' · ' + pt.time;
    tt.appendChild(dateLine);

    const valLine = document.createElement('strong');
    valLine.textContent = fmt(pt.y, 1) + pt.unitSuffix;
    tt.appendChild(valLine);

    if (showMovingAvg && Number.isFinite(pt.ma7)) {
      const maLine = document.createElement('div');
      maLine.className = 'tt-sub';
      maLine.textContent = t('chart.tooltipMa7', {
        value: fmt(pt.ma7, 1),
        unit: pt.unitSuffix
      });
      tt.appendChild(maLine);
    }

    tt.hidden = false;

    const ttWidth = tt.offsetWidth || 150;
    const ttHeight = tt.offsetHeight || 54;
    let leftPos = pt.xPx + 12;
    if (leftPos + ttWidth > canvasWidth - 6) {
      leftPos = Math.max(6, pt.xPx - ttWidth - 12);
    }
    let topPos = pt.yPx - ttHeight - 10;
    if (topPos < 6) {
      topPos = Math.min(200, pt.yPx + 12);
    }
    tt.style.left = leftPos.toFixed(0) + 'px';
    tt.style.top = topPos.toFixed(0) + 'px';
  }

  function renderChartLegend(hasData) {
    const legend = $('chartLegend');
    if (!legend) return;
    if (!hasData || !showMovingAvg) {
      legend.hidden = true;
      legend.textContent = '';
      return;
    }
    legend.hidden = false;
    legend.textContent = '';

    const item1 = document.createElement('span');
    item1.className = 'legend-item';
    const sw1 = document.createElement('span');
    sw1.className = 'legend-swatch';
    item1.appendChild(sw1);
    item1.appendChild(document.createTextNode(t('chart.legendValue')));

    const item2 = document.createElement('span');
    item2.className = 'legend-item';
    const sw2 = document.createElement('span');
    sw2.className = 'legend-swatch ma';
    item2.appendChild(sw2);
    item2.appendChild(document.createTextNode(t('chart.legendMa7')));

    legend.appendChild(item1);
    legend.appendChild(item2);
  }

  function draw() {
    const palette = getComputedStyle(document.documentElement);
    const chartColor = (token, fallback) =>
      palette.getPropertyValue(token).trim() || fallback;

    const canvas = $('trend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(200, rect.width);
    const h = 260;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const k = $('metricSelect').value || 'kg';
    const allPts = rows
      .map((r) => ({
        x: rowTimestamp(r),
        y: getValue(r, k),
        date: r.date,
        time: r.time
      }))
      .filter((p) => p.y !== null && Number.isFinite(p.y));

    const allMa7 = computeMovingAverage(allPts);
    allPts.forEach((p, idx) => {
      p.ma7 = allMa7[idx];
    });

    let pts = allPts;
    if (chartRange !== 'all' && allPts.length) {
      const rangeDays = Number(chartRange);
      const anchorTs = allPts[allPts.length - 1].x;
      const cutoff = anchorTs - rangeDays * DAY_MS;
      pts = allPts.filter((p) => p.x >= cutoff);
    }

    if (!allPts.length) {
      $('chartNote').textContent = t('chart.noValues');
    } else if (!pts.length) {
      $('chartNote').textContent = t('chart.noValuesInRange');
    } else if (pts.length === 1) {
      $('chartNote').textContent = t('chart.single');
    } else if (pts.length < allPts.length) {
      $('chartNote').textContent = t('chart.pointsInRange', {
        count: pts.length,
        total: allPts.length,
        metric: I18N.metricLabel(k)
      });
    } else {
      $('chartNote').textContent = t('chart.points', {
        count: pts.length,
        metric: I18N.metricLabel(k)
      });
    }

    if (!pts.length) {
      lastChartPoints = [];
      activeChartPointIdx = null;
      hideChartTooltip();
      renderChartLegend(false);
      ctx.font = '13px -apple-system,sans-serif';
      ctx.fillStyle = chartColor('--chart-blank', '#9db0c5');
      ctx.fillText(t('chart.noData'), 15, 140);
      return;
    }

    const ys = pts.map((p) => p.y);
    if (showMovingAvg) {
      pts.forEach((p) => {
        if (Number.isFinite(p.ma7)) ys.push(p.ma7);
      });
    }
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    const padding = Math.max((hi - lo) * 0.25, Math.max(Math.abs(hi) * 0.03, 0.3));
    const min = lo - padding;
    const max = hi + padding;

    const left = 49;
    const right = w - 15;
    const top = 22;
    const bot = h - 42;

    ctx.font = '12px -apple-system,sans-serif';
    ctx.strokeStyle = chartColor('--chart-grid', '#34506a');
    ctx.fillStyle = chartColor('--chart-blank', '#9db0c5');

    for (let i = 0; i < 5; i++) {
      const y = top + ((bot - top) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
      ctx.fillText(fmt(max - ((max - min) * i) / 4, 1), 3, y + 4);
    }

    const xs = pts.map((p) => p.x);
    let xmin = Math.min(...xs);
    let xmax = Math.max(...xs);
    if (xmax === xmin) {
      xmin -= DAY_MS;
      xmax += DAY_MS;
    }

    const X = (v) => left + ((v - xmin) / (xmax - xmin)) * (right - left);
    const Y = (v) => bot - ((v - min) / (max - min)) * (bot - top);

    ctx.fillStyle = chartColor('--muted', '#b7c8d6');
    const locale = I18N.getLocale();
    ctx.fillText(new Date(Math.min(...xs)).toLocaleDateString(locale), left, bot + 26);
    if (pts.length > 1) {
      ctx.fillText(
        new Date(Math.max(...xs)).toLocaleDateString(locale),
        Math.max(left, right - 83),
        bot + 26
      );
    }

    const grad = ctx.createLinearGradient(0, top, 0, bot);
    grad.addColorStop(0, chartColor('--chart-fill', '#56d5db65'));
    grad.addColorStop(1, '#56d5db00');

    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
    ctx.lineTo(X(pts[pts.length - 1].x), bot);
    ctx.lineTo(X(pts[0].x), bot);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
    ctx.strokeStyle = chartColor('--chart-line', '#56d5db');
    ctx.lineWidth = 3;
    ctx.stroke();

    if (showMovingAvg && pts.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      pts.forEach((p, i) =>
        i ? ctx.lineTo(X(p.x), Y(p.ma7)) : ctx.moveTo(X(p.x), Y(p.ma7))
      );
      ctx.strokeStyle = chartColor('--amber', '#ffc77c');
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();
    }

    const u = unit(k);
    const unitSuffix = u ? ' ' + u : '';

    lastChartPoints = pts.map((p) => ({
      xPx: X(p.x),
      yPx: Y(p.y),
      date: p.date,
      time: p.time,
      y: p.y,
      ma7: p.ma7,
      unitSuffix: unitSuffix
    }));

    if (activeChartPointIdx !== null && activeChartPointIdx >= lastChartPoints.length) {
      activeChartPointIdx = null;
    }

    // Optional crosshair for active hovered/tapped point
    if (activeChartPointIdx !== null && lastChartPoints[activeChartPointIdx]) {
      const ap = lastChartPoints[activeChartPointIdx];
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(ap.xPx, top);
      ctx.lineTo(ap.xPx, bot);
      ctx.strokeStyle = chartColor('--cyan', '#66e5e6');
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    lastChartPoints.forEach((p, idx) => {
      const isActive = idx === activeChartPointIdx;
      ctx.beginPath();
      ctx.arc(p.xPx, p.yPx, isActive ? 6.5 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = isActive
        ? chartColor('--cyan', '#66e5e6')
        : chartColor('--chart-dot', '#9be7ae');
      ctx.fill();
      if (isActive) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = chartColor('--txt', '#ffffff');
        ctx.stroke();
      }
    });

    renderChartLegend(pts.length > 1);

    if (activeChartPointIdx !== null && lastChartPoints[activeChartPointIdx]) {
      renderChartTooltip(lastChartPoints[activeChartPointIdx], w);
    } else {
      hideChartTooltip();
    }
  }

  function findNearestChartPoint(clientX, clientY) {
    const canvas = $('trend');
    if (!canvas || !lastChartPoints.length) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let bestIdx = null;
    let bestDist = Infinity;
    lastChartPoints.forEach((pt, idx) => {
      const dx = pt.xPx - x;
      const dy = pt.yPx - y;
      const dist = Math.hypot(dx, dy);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    return bestDist <= 42 ? bestIdx : null;
  }

  const trendCanvas = $('trend');
  if (trendCanvas) {
    trendCanvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const idx = findNearestChartPoint(e.clientX, e.clientY);
      if (idx !== activeChartPointIdx) {
        activeChartPointIdx = idx;
        draw();
      }
    });

    trendCanvas.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'touch') return;
      if (activeChartPointIdx !== null) {
        activeChartPointIdx = null;
        draw();
      }
    });

    trendCanvas.addEventListener('click', (e) => {
      const idx = findNearestChartPoint(e.clientX, e.clientY);
      activeChartPointIdx = idx === activeChartPointIdx ? null : idx;
      draw();
    });
  }

  // --- CSV import & export ---

  function parseCSV(text) {
    const cleaned = text.replace(/^\uFEFF/, '');
    const lines = cleaned.split(/\r?\n/);
    const headerIdx = lines.findIndex((s) => /^Datum;Uhrzeit;/i.test(s.trim()));
    if (headerIdx < 0) {
      throw new Error(t('error.noBeurerTable'));
    }

    const cols = lines[headerIdx].split(';').map((c) => c.trim());
    const output = [];

    for (const line of lines.slice(headerIdx + 1)) {
      if (!/^\d{2}\.\d{2}\.\d{4};\d{2}:\d{2};/.test(line.trim())) continue;
      const parts = line.split(';');
      const values = {};

      cols.slice(2).forEach((colKey, j) => {
        if (!colKey || colKey === 'Kommentar' || colKey === 'Medikation') return;
        const v = parseNumber(parts[j + 2]);
        if (v !== null) values[colKey] = v;
      });

      output.push({
        date: parts[0].trim(),
        time: parts[1].trim(),
        values: values
      });
    }

    if (!output.length) {
      throw new Error(t('error.noValidRows'));
    }
    return output;
  }

  function exportEnrichedCsv() {
    if (!rows.length) {
      toast(t('export.empty'));
      return;
    }

    const colSet = new Set();
    rows.forEach((r) => {
      Object.keys(r.values || {}).forEach((k) => {
        if (k !== 'Kommentar' && k !== 'Medikation') colSet.add(k);
      });
    });

    const cols = ['Datum', 'Uhrzeit', ...colSet];
    const escapeCell = (v) => {
      const s = String(v === null || v === undefined ? '' : v);
      return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    const csvLines = [
      cols.join(';'),
      ...rows.map((r) =>
        cols
          .map((k) => {
            if (k === 'Datum') return escapeCell(r.date);
            if (k === 'Uhrzeit') return escapeCell(r.time);
            return escapeCell(fmtCsvDecimal(r.values[k]));
          })
          .join(';')
      )
    ];

    const blob = new Blob(['\uFEFF' + csvLines.join('\r\n')], {
      type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AtlasSometria_Messwerte.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    recordBackupExported();
    toast(t('export.done'));
  }

  $('csvFile').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    showResult('import.readingTitle', [{ key: 'import.readingDetail', vars: { file: f.name } }]);

    try {
      const incoming = parseCSV(await f.text());
      incoming.sort((a, b) => rowTimestamp(a) - rowTimestamp(b));

      let added = 0;
      let updated = 0;
      let changedFields = 0;

      for (const r of incoming) {
        const existing = rows.find((v) => rowKey(v) === rowKey(r));
        if (existing) {
          for (const [k, v] of Object.entries(r.values)) {
            if (existing.values[k] !== v) changedFields++;
          }
          existing.values = Object.assign({}, existing.values, r.values);
          updated++;
        } else {
          rows.push(r);
          added++;
          changedFields += Object.keys(r.values).length;
        }
      }

      rows.sort((a, b) => rowTimestamp(a) - rowTimestamp(b));
      const lastIncoming = incoming[incoming.length - 1];
      selected = rows.findIndex((v) => rowKey(v) === rowKey(lastIncoming));
      if (selected < 0) selected = rows.length - 1;
      activeChartPointIdx = null;

      save();
      if (added > 0 || changedFields > 0) {
        recordDataChange(Math.max(1, added));
      }
      render();

      const same = added === 0 && changedFields === 0;
      const lines = [
        {
          key: same ? 'import.doneSame' : 'import.doneChanged',
          vars: { added: added, updated: updated }
        }
      ];
      if (incoming.length) {
        lines.push({
          key: 'import.doneRange',
          vars: {
            from: incoming[0].date,
            to: incoming[incoming.length - 1].date
          }
        });
      }
      lines.push({
        key: 'import.doneTotal',
        vars: { total: rows.length }
      });

      showResult('import.doneTitle', lines);
      toast(t('import.toastDone'));
    } catch (err) {
      const msg = err && err.message ? String(err.message) : String(err);
      showResult('import.failTitle', [msg]);
      toast(t('import.failAlert', { message: msg }));
    } finally {
      e.target.value = '';
    }
  });

  $('exportBtn').addEventListener('click', exportEnrichedCsv);

  $('deleteSelectedBtn').addEventListener('click', () => {
    if (!rows.length || !rows[selected]) {
      toast(t('deleteSelected.empty'));
      return;
    }
    const target = rows[selected];
    if (
      !window.confirm(
        t('deleteSelected.confirm', { date: target.date, time: target.time })
      )
    ) {
      return;
    }
    rows.splice(selected, 1);
    if (selected >= rows.length) selected = Math.max(0, rows.length - 1);
    activeChartPointIdx = null;
    save();
    recordDataChange(1);
    render();
    toast(t('deleteSelected.done', { date: target.date, time: target.time }));
  });

  $('clearBtn').addEventListener('click', () => {
    if (!window.confirm(t('clear.confirm'))) return;
    rows = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore unavailable storage
    }
    selected = 0;
    activeChartPointIdx = null;
    lastResultState = null;
    $('importResult').hidden = true;
    render();
    toast(t('clear.done'));
  });

  // --- Calorie modal & OCR ---

  function revokePreviewUrl() {
    if (activePreviewUrl) {
      URL.revokeObjectURL(activePreviewUrl);
      activePreviewUrl = null;
    }
  }

  function fillEdit() {
    const r = rows[+$('editDate').value];
    $('bmr').value = getValue(r, 'Grundumsatz') ?? '';
    $('amr').value = getValue(r, 'Leistungsumsatz') ?? '';
  }

  function openEdit(mode) {
    if (!rows.length) {
      toast(t('edit.needCsv'));
      return false;
    }
    $('editModal').classList.add('show');
    $('editDate').innerHTML = rows
      .map(
        (r, i) =>
          '<option value="' +
          i +
          '" ' +
          (i === selected ? 'selected' : '') +
          '>' +
          r.date +
          ' · ' +
          r.time +
          '</option>'
      )
      .join('');
    fillEdit();
    setOcrStatus(mode === 'scan' ? 'edit.scanPrompt' : 'edit.manualPrompt');
    revokePreviewUrl();
    $('preview').classList.add('hide');
    $('preview').removeAttribute('src');
    if (mode === 'manual') {
      setTimeout(() => {
        const bmrEl = $('bmr');
        if (bmrEl) bmrEl.focus();
      }, 30);
    }
    return true;
  }

  function closeEdit() {
    $('editModal').classList.remove('show');
    $('preview').classList.add('hide');
    $('preview').removeAttribute('src');
    revokePreviewUrl();
  }

  function openInstallModal() {
    $('installModal').classList.add('show');
  }

  function closeInstallModal() {
    $('installModal').classList.remove('show');
  }

  $('editDate').addEventListener('change', fillEdit);
  $('manualBtn').addEventListener('click', () => openEdit('manual'));
  $('closeModal').addEventListener('click', closeEdit);
  $('cancelModal').addEventListener('click', closeEdit);
  $('editModal').addEventListener('click', (e) => {
    if (e.target === $('editModal')) closeEdit();
  });

  $('closeInstallModal').addEventListener('click', closeInstallModal);
  $('doneInstallModal').addEventListener('click', closeInstallModal);
  $('installModal').addEventListener('click', (e) => {
    if (e.target === $('installModal')) closeInstallModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('editModal').classList.contains('show')) closeEdit();
    if ($('installModal').classList.contains('show')) closeInstallModal();
  });

  $('saveKcal').addEventListener('click', () => {
    const b = parseKcal($('bmr').value);
    const a = parseKcal($('amr').value);

    if (
      (b === null && a === null) ||
      (b !== null && (b < 300 || b > 10000)) ||
      (a !== null && (a < 300 || a > 15000))
    ) {
      toast(t('edit.invalidKcal'));
      return;
    }

    const idx = +$('editDate').value;
    const r = rows[idx];
    if (!r) {
      toast(t('edit.noSelection'));
      return;
    }

    if (b !== null) r.values.Grundumsatz = b;
    if (a !== null) r.values.Leistungsumsatz = a;

    selected = idx;
    save();
    recordDataChange(1);
    render();
    closeEdit();
    toast(t('edit.savedToast'));
    showResult('edit.savedTitle', [
      {
        key: 'edit.savedDetail',
        vars: {
          bmr: fmt(getValue(r, 'Grundumsatz')),
          amr: fmt(getValue(r, 'Leistungsumsatz'))
        }
      }
    ]);
  });

  function parseOCR(text) {
    const normalized = text.replace(/\u00a0/g, ' ').replace(/[\u2019\u2018]/g, "'");
    const lines = normalized
      .split(/\n/)
      .map((x) => x.trim())
      .filter(Boolean);

    const patterns = [
      { key: 'bmr', re: /grundumsatz|basal\s*metabolic|\bbmr\b/i },
      { key: 'amr', re: /leistungsumsatz|aktivita.tsum[s]?atz|active\s*metabolic|\bamr\b/i }
    ];

    const found = {};

    const readKcalFromLine = (line) => {
      const matches = line.replace(/\s/g, '').match(/(\d[\d.,]{2,9})\s*(?:kcal)?/gi) || [];
      for (const rawMatch of matches) {
        const cleaned = rawMatch.replace(/kcal/gi, '');
        const n = parseKcal(cleaned);
        if (n !== null && n >= 300 && n <= 15000) return n;
      }
      return null;
    };

    for (let i = 0; i < lines.length; i++) {
      for (const p of patterns) {
        if (p.re.test(lines[i])) {
          const val =
            readKcalFromLine(lines[i].replace(p.re, '')) ??
            readKcalFromLine(lines[i + 1] || '');
          if (val !== null) found[p.key] = val;
        }
      }
    }

    return found;
  }

  async function loadOCR() {
    if (window.Tesseract) return;
    const src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
    await new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = src;
      tag.onload = resolve;
      tag.onerror = () => reject(new Error(t('ocr.loadError')));
      document.head.appendChild(tag);
    });
  }

  $('imageFile').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;

    if (!rows.length) {
      toast(t('edit.needCsv'));
      return;
    }

    showResult('ocr.selectedTitle', [
      { key: 'ocr.selectedDetail', vars: { file: f.name } }
    ]);

    if (!openEdit('scan')) return;

    activePreviewUrl = URL.createObjectURL(f);
    $('preview').src = activePreviewUrl;
    $('preview').classList.remove('hide');
    setOcrStatus('ocr.running');

    try {
      await loadOCR();
      const worker = await window.Tesseract.createWorker('deu+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrStatus('ocr.progress', { percent: Math.round(m.progress * 100) });
          }
        }
      });

      let result;
      try {
        result = await worker.recognize(f);
      } finally {
        await worker.terminate();
      }

      const values = parseOCR(result.data.text);
      if (values.bmr !== undefined) $('bmr').value = values.bmr;
      if (values.amr !== undefined) $('amr').value = values.amr;

      const count = Number(values.bmr !== undefined) + Number(values.amr !== undefined);
      setOcrStatus(count ? 'ocr.foundModal' : 'ocr.noneModal', { count: count });
      showResult('ocr.doneTitle', [
        { key: count ? 'ocr.doneFound' : 'ocr.doneNone', vars: { count: count } }
      ]);
    } catch (err) {
      const msg = err && err.message ? String(err.message) : String(err);
      setOcrStatus('ocr.failModal', { message: msg });
      showResult('ocr.failTitle', [{ key: 'ocr.failDetail', vars: { message: msg } }]);
    }
  });

  // --- PWA install button & service worker registration ---

  function updateInstallButton() {
    const btn = $('installBtn');
    if (!btn) return;
    if (isInstalledPwa) {
      btn.hidden = true;
      return;
    }
    if (deferredInstallPrompt) {
      btn.hidden = false;
      btn.textContent = t('actions.installApp');
      return;
    }
    if (isIosBrowser) {
      btn.hidden = false;
      btn.textContent = t('actions.installAppIos');
      return;
    }
    btn.hidden = true;
  }

  function initPwa() {
    isInstalledPwa =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;

    const ua = (window.navigator.userAgent || '').toLowerCase();
    isIosBrowser =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      updateInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      isInstalledPwa = true;
      deferredInstallPrompt = null;
      updateInstallButton();
      toast(t('install.installedToast'));
    });

    const btn = $('installBtn');
    if (btn) {
      btn.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
          await deferredInstallPrompt.prompt();
          const choice = await deferredInstallPrompt.userChoice;
          if (choice && choice.outcome === 'accepted') {
            isInstalledPwa = true;
            deferredInstallPrompt = null;
            updateInstallButton();
          }
        } else if (isIosBrowser) {
          openInstallModal();
        }
      });
    }

    // Register service worker only over HTTPS or localhost (keeps file:// clean)
    const isSecureOrigin =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if ('serviceWorker' in navigator && isSecureOrigin) {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Non-fatal: app works identically without service worker
      });
    }

    updateInstallButton();
  }

  // --- Segment interaction ---

  $('segments').addEventListener('click', (e) => {
    const card = e.target.closest('[data-segment]');
    if (!card) return;
    selectedSegment = card.dataset.segment;
    render();
  });

  $('segments').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-segment]');
    if (!card) return;
    e.preventDefault();
    selectedSegment = card.dataset.segment;
    render();
    const active = Array.from($('segments').querySelectorAll('[data-segment]')).find(
      (el) => el.dataset.segment === selectedSegment
    );
    if (active) active.focus();
  });

  // --- Controls, theme & language ---

  $('dateSelect').addEventListener('change', (e) => {
    selected = +e.target.value;
    render();
  });

  $('compareSelect').addEventListener('change', (e) => {
    compareMode = e.target.value || 'prev';
    render();
  });

  $('metricSelect').addEventListener('change', () => {
    activeChartPointIdx = null;
    draw();
  });

  $('rangeSelect').addEventListener('change', (e) => {
    chartRange = e.target.value || 'all';
    activeChartPointIdx = null;
    draw();
  });

  $('maToggle').addEventListener('change', (e) => {
    showMovingAvg = Boolean(e.target.checked);
    draw();
  });

  window.addEventListener('resize', draw);

  function applyTheme(theme) {
    const validTheme = THEME_NAMES.includes(theme) ? theme : 'dark';
    document.documentElement.dataset.theme = validTheme;
    $('themeSelect').value = validTheme;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content =
        getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() ||
        '#080f1e';
    }
    try {
      localStorage.setItem(THEME_KEY, validTheme);
    } catch {
      // Ignore unavailable storage
    }
    draw();
  }

  function applyLanguage(lang) {
    const activeLang = I18N.setLang(lang);
    $('languageSelect').value = activeLang;
    I18N.applyStaticTranslations(document);
    populateMetricSelect();
    updateInstallButton();
    render();
    if (lastResultState) renderResultBanner();
    if (lastOcrStatusState && $('editModal').classList.contains('show')) {
      setOcrStatus(lastOcrStatusState.key, lastOcrStatusState.vars);
    }
  }

  $('themeSelect').addEventListener('change', (e) => applyTheme(e.target.value));
  $('languageSelect').addEventListener('change', (e) => applyLanguage(e.target.value));

  // --- Safe initialization order ---

  let storedTheme = 'dark';
  try {
    storedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    storedTheme = 'dark';
  }

  load();
  initPwa();
  populateMetricSelect();
  applyLanguage(I18N.getLang());
  applyTheme(storedTheme);
})();
