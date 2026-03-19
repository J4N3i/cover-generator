/* ============================================================
   SLIIT Report Cover Page Generator  —  popup.js  v4.0
   Professional academic cover with wizard UI
   ============================================================ */

const store = typeof browser !== 'undefined' ? browser.storage.local
  : typeof chrome !== 'undefined' ? chrome.storage.local
    : null;

const FIELDS = ['reportTitle', 'reportType', 'subDate', 'semester',
  'modName', 'modCode', 'faculty', 'lecturer',
  'sName', 'sID', 'indexNo', 'degree', 'group', 'labGroup'];

let logoSrc = null;
let curStep = 1;
const STEPS = 4;
const STEP_NAMES = ['Report Details', 'Module & Lecturer', 'Student Details', 'Logo'];

// ── Boot ──────────────────────────────────────────────────────
document.getElementById('subDate').value = isoToday();
loadSaved();
renderStep();

// ── Step logic ────────────────────────────────────────────────
function renderStep() {
  // panels
  for (let i = 1; i <= STEPS; i++) {
    document.getElementById(`s${i}`).classList.toggle('on', i === curStep);
  }

  // progress dots
  const prog = document.getElementById('progress');
  let dotsHTML = `<span class="dot-label">Step ${curStep} of ${STEPS}</span>`;
  for (let i = 1; i <= STEPS; i++) {
    const cls = i < curStep ? 'done' : i === curStep ? 'on' : '';
    dotsHTML += `<div class="dot ${cls}" data-step="${i}"></div>`;
  }
  prog.innerHTML = dotsHTML;
  prog.querySelectorAll('.dot').forEach(d => {
    d.addEventListener('click', () => {
      curStep = parseInt(d.dataset.step);
      renderStep();
    });
  });

  document.getElementById('stepLabel')?.remove();
  document.getElementById('navStep').textContent = STEP_NAMES[curStep - 1];

  const back = document.getElementById('btnBack');
  const next = document.getElementById('btnNext');
  const foot = document.getElementById('actionFoot');
  const nav = document.getElementById('navBar');

  back.style.visibility = curStep === 1 ? 'hidden' : 'visible';

  if (curStep === STEPS) {
    next.textContent = 'Generate ✓';
    next.className = 'nav-btn primary';
    foot.style.display = 'block';
  } else {
    next.innerHTML = `Next <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>`;
    next.className = 'nav-btn primary';
    foot.style.display = 'none';
  }
}

document.getElementById('btnNext').addEventListener('click', () => {
  if (!validateStep()) return;
  if (curStep < STEPS) { curStep++; renderStep(); }
});
document.getElementById('btnBack').addEventListener('click', () => {
  if (curStep > 1) { curStep--; renderStep(); }
});

function validateStep() {
  const required = {
    1: ['reportTitle'],
    2: ['modName'],
    3: ['sName', 'sID'],
    4: []
  };
  let ok = true;
  (required[curStep] || []).forEach(id => {
    const el = document.getElementById(id);
    if (!gv(id)) {
      el.classList.add('invalid');
      el.addEventListener('input', () => el.classList.remove('invalid'), { once: true });
      ok = false;
    }
  });
  if (!ok) toast('Please fill in the required fields.', false);
  return ok;
}

// ── Memory ─────────────────────────────────────────────────────
const memTog = document.getElementById('memTog');
let memOn = false;

memTog.addEventListener('click', () => {
  memOn = !memOn;
  memTog.classList.toggle('on', memOn);
  if (!memOn && store) store.remove('sliit4');
});

function saveIfOn() {
  if (!memOn || !store) return;
  const d = { _v: 4 };
  FIELDS.forEach(id => { d[id] = gv(id); });
  store.set({ sliit4: d });
}

function loadSaved() {
  if (!store) return;
  store.get('sliit4', res => {
    const d = res?.sliit4;
    if (!d?._v) return;
    memOn = true;
    memTog.classList.add('on');
    FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && d[id] !== undefined) el.value = d[id];
    });
  });
}

// ── Logo ──────────────────────────────────────────────────────
const logoZone = document.getElementById('logoZone');

['dragenter', 'dragover'].forEach(e => logoZone.addEventListener(e, ev => {
  ev.preventDefault(); logoZone.classList.add('drag-over');
}));
['dragleave', 'drop'].forEach(e => logoZone.addEventListener(e, ev => {
  ev.preventDefault(); logoZone.classList.remove('drag-over');
  if (e === 'drop') {
    const f = ev.dataTransfer.files[0];
    if (f?.type.startsWith('image/')) readFile(f);
  }
}));

function applyLogo(src) {
  logoSrc = src;
  document.getElementById('logoPreview').innerHTML =
    `<img src="${src}" alt="SLIIT Logo"/>
     <div>
       <div style="font-size:10.5px;color:var(--muted)">Logo loaded ✓</div>
       <div style="font-size:10px;color:var(--dim);margin-top:2px;">Will appear on cover page</div>
     </div>`;
  document.getElementById('logoClearRow').style.display = 'block';
}

function removeLogo() {
  logoSrc = null;
  document.getElementById('logoPreview').innerHTML = `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".25">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <div>
      <div id="lpTxt" style="font-size:10.5px;color:var(--muted);">No logo uploaded</div>
      <div style="font-size:10px;color:var(--dim);margin-top:2px;">A professional placeholder will be used</div>
    </div>`;
  document.getElementById('logoClearRow').style.display = 'none';

  document.getElementById('logoFile').value = '';
}

function readFile(file) {
  const r = new FileReader();
  r.onload = ev => applyLogo(ev.target.result);
  r.readAsDataURL(file);
}


document.getElementById('logoFile').addEventListener('change', e => {
  const f = e.target.files[0];
  if (f?.type.startsWith('image/')) readFile(f);
  else if (f) toast('Please select an image file.', false);
});

// ── Helpers ──────────────────────────────────────────────────
function gv(id) { return (document.getElementById(id)?.value || '').trim(); }
function isoToday() { return new Date().toISOString().split('T')[0]; }
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function getF() {
  return {
    title: gv('reportTitle'), type: gv('reportType'),
    date: fmtDate(gv('subDate')), sem: gv('semester'),
    mod: gv('modName'), code: gv('modCode'),
    fac: gv('faculty'), lect: gv('lecturer'),
    name: gv('sName'), id: gv('sID'),
    idx: gv('indexNo'), deg: gv('degree'),
    grp: gv('group'), lab: gv('labGroup'),
    logo: logoSrc,
  };
}
function toast(msg, ok = true) {
  const el = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').innerHTML = ok
    ? '<polyline points="20 6 9 17 4 12"/>'
    : '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
  el.className = `toast on ${ok ? 'ok' : 'err'}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), 4000);
}
function busy(id, on) {
  const b = document.getElementById(id);
  b.disabled = on; b.classList.toggle('loading', on);
}
function dl(blob, name) {
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 1500);
}

// ── PDF ──────────────────────────────────────────────────────
document.getElementById('btnPDF').addEventListener('click', async () => {
  saveIfOn();
  busy('btnPDF', true);
  try {
    const f = getF();
    const html = buildCoverHTML(f);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        setTimeout(() => { try { win.print(); } catch (_) { } }, 800);
        setTimeout(() => URL.revokeObjectURL(url), 15000);
      };
      toast('Cover opened — press Ctrl+P / Cmd+P → Save as PDF');
    } else {
      dl(blob, `SLIIT_Cover_${f.id || 'report'}.html`);
      toast('HTML downloaded — open it and print to PDF.', true);
    }
  } catch (e) { console.error(e); toast('Error generating PDF.', false); }
  finally { busy('btnPDF', false); }
});

// ── Word ─────────────────────────────────────────────────────
document.getElementById('btnWord').addEventListener('click', async () => {
  saveIfOn();
  busy('btnWord', true);
  try {
    const f = getF();
    if (typeof docx !== 'undefined') {
      await buildDocx(f);
      toast('Word document downloaded!');
    } else {
      buildRTF(f);
      toast('Downloaded as .rtf — run setup.sh for full .docx support.', true);
    }
  } catch (e) { console.error(e); toast('Error generating Word document.', false); }
  finally { busy('btnWord', false); }
});

// ══════════════════════════════════════════════════════════════
//  PROFESSIONAL COVER HTML
//
//  Design decisions:
//  • Clean white A4 page, 1-inch margins
//  • Thin navy rule at very top (institutional gravitas)
//  • Logo centred, generous white space below
//  • University name + faculty in refined serif typography
//  • Horizontal rule in SLIIT navy
//  • Report type in small-caps tracking, muted
//  • Report TITLE large, bold, navy — the centrepiece
//  • Thin rule below title
//  • Two-column info grid (professional, readable at a glance)
//  • Thin navy rule at bottom
//  All colours match SLIIT brand: #002060 navy, #e8690a orange
// ══════════════════════════════════════════════════════════════
function buildCoverHTML(f) {
  const NAVY = '#002060';
  const ORANGE = '#e8690a';
  const LGRAY = '#f0f2f8';
  const MGRAY = '#c8cedd';
  const DGRAY = '#4a5a78';

  // Logo block — uploaded or professional SVG replica
  const logoBlock = f.logo
    ? `<img src="${f.logo}" alt="SLIIT"
           style="display:block;margin:0 auto;max-height:120px;max-width:240px;object-fit:contain;"/>`
    : /* SVG shield matching SLIIT brand colours */
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"
            style="display:block;margin:0 auto;width:120px;height:120px;">
        <!-- Shield body -->
        <path d="M110 8 L198 44 L198 108 C198 158 160 192 110 204 C60 192 22 158 22 108 L22 44 Z"
              fill="${NAVY}"/>
        <!-- Inner lighter band -->
        <path d="M110 22 L185 54 L185 108 C185 150 152 181 110 192 C68 181 35 150 35 108 L35 54 Z"
              fill="${NAVY}" opacity=".0"/>
        <!-- Grid blocks top -->
        <rect x="38" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="54" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="70" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="134" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="150" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="166" y="42" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="38" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="54" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="70" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="134" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="150" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="166" y="58" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <!-- Grid blocks bottom -->
        <rect x="30" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="46" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="62" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="30" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="46" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="62" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="145" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="161" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="177" y="148" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="145" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="161" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <rect x="177" y="164" width="13" height="13" rx="1" fill="#1a3a8a"/>
        <!-- SLIIT wordmark -->
        <text x="110" y="140" text-anchor="middle"
              font-family="Arial Black, Arial, sans-serif"
              font-size="58" font-weight="900"
              fill="${ORANGE}" letter-spacing="-3">SLIIT</text>
        <!-- Lion outline (minimal) -->
        <ellipse cx="110" cy="68" rx="20" ry="22" fill="${ORANGE}"/>
        <ellipse cx="102" cy="62" rx="7" ry="8" fill="${NAVY}"/>
        <ellipse cx="118" cy="62" rx="7" ry="8" fill="${NAVY}"/>
        <!-- Shield border -->
        <path d="M110 8 L198 44 L198 108 C198 158 160 192 110 204 C60 192 22 158 22 108 L22 44 Z"
              fill="none" stroke="${NAVY}" stroke-width="2"/>
      </svg>`;

  // Build info table rows — only filled fields
  const rows = [
    { label: 'Module Code', value: f.code },
    { label: 'Module Name', value: f.mod },
    { label: 'Faculty', value: f.fac },
    { label: 'Lecturer / Supervisor', value: f.lect },
    { label: 'Student Name', value: f.name },
    { label: 'Student ID', value: f.id },
    { label: 'Index Number', value: f.idx },
    { label: 'Degree Programme', value: f.deg },
    { label: 'Academic Year', value: f.sem },
    { label: 'Group / Batch', value: f.grp },
    { label: 'Lab Group', value: f.lab },
    { label: 'Date of Submission', value: f.date },
  ].filter(r => r.value);

  // Split rows into 2 columns for a professional grid layout
  const half = Math.ceil(rows.length / 2);
  const col1 = rows.slice(0, half);
  const col2 = rows.slice(half);
  const maxRows = Math.max(col1.length, col2.length);

  let tableBody = '';
  for (let i = 0; i < maxRows; i++) {
    const r1 = col1[i] || null;
    const r2 = col2[i] || null;
    tableBody += `<tr>
      ${r1 ? `<td class="lbl">${esc(r1.label)}</td><td class="val">${esc(r1.value)}</td>` : `<td></td><td></td>`}
      <td class="sep"></td>
      ${r2 ? `<td class="lbl">${esc(r2.label)}</td><td class="val">${esc(r2.value)}</td>` : `<td></td><td></td>`}
    </tr>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${esc(f.code || 'SLIIT')} — ${esc(f.title)}</title>
<style>
  /* ── Reset & print setup ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4 portrait; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; }
    .no-print  { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }

  /* ── Page ── */
  body {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    font-family: 'Times New Roman', Times, serif;
    color: #000;
    display: flex;
    flex-direction: column;
  }

  /* ── Top rule — 6mm navy band ── */
  .top-rule {
    height: 6mm;
    background: ${NAVY};
    width: 100%;
    flex-shrink: 0;
  }
  /* ── Orange accent under navy ── */
  .top-accent {
    height: 2mm;
    background: ${ORANGE};
    width: 100%;
    flex-shrink: 0;
  }

  /* ── Main content area ── */
  .page-body {
    flex: 1;
    padding: 14mm 22mm 10mm;
    display: flex;
    flex-direction: column;
  }

  /* ── Institution block ── */
  .inst-block {
    text-align: center;
    margin-bottom: 8mm;
  }
  .inst-name {
    font-family: 'Times New Roman', Times, serif;
    font-size: 16pt;
    font-weight: 700;
    color: ${NAVY};
    letter-spacing: .03em;
    line-height: 1.25;
    text-transform: uppercase;
  }
  .inst-sub {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    color: ${DGRAY};
    margin-top: 3pt;
    letter-spacing: .04em;
  }

  /* ── Logo ── */
  .logo-block {
    text-align: center;
    margin: 6mm 0 8mm;
  }

  /* ── Horizontal rule ── */
  .rule { width: 100%; height: 1.5pt; background: ${NAVY}; margin: 0; }
  .rule-thin { width: 100%; height: .75pt; background: ${MGRAY}; margin: 0; }

  /* ── Report type label ── */
  .report-type-label {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: ${DGRAY};
    margin: 6mm 0 3mm;
  }

  /* ── Report title ── */
  .report-title {
    text-align: center;
    font-family: 'Times New Roman', Times, serif;
    font-size: 22pt;
    font-weight: 700;
    color: ${NAVY};
    line-height: 1.25;
    margin-bottom: 8mm;
  }

  /* ── Info grid ── */
  .info-section {
    margin-top: 2mm;
    border: 1pt solid ${MGRAY};
    border-radius: 2mm;
    overflow: hidden;
  }
  .info-header {
    background: ${NAVY};
    padding: 5pt 12pt;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #fff;
  }
  table.info-table {
    width: 100%;
    border-collapse: collapse;
  }
  table.info-table tr { border-bottom: .75pt solid #e8ecf4; }
  table.info-table tr:last-child { border-bottom: none; }
  table.info-table tr:nth-child(even) td { background: #f8f9fd; }
  td.lbl {
    padding: 6pt 10pt 6pt 12pt;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    font-weight: 700;
    color: ${DGRAY};
    text-transform: uppercase;
    letter-spacing: .04em;
    white-space: nowrap;
    width: 20%;
  }
  td.val {
    padding: 6pt 10pt;
    font-family: 'Times New Roman', Times, serif;
    font-size: 10.5pt;
    color: #111;
    width: 28%;
  }
  td.sep {
    width: 4%;
    border-left: .75pt solid ${MGRAY};
  }

  /* ── Spacer ── */
  .spacer { flex: 1; }

  /* ── Footer ── */
  .page-footer {
    text-align: center;
    padding: 4mm 0 0;
    border-top: .75pt solid ${MGRAY};
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8pt;
    color: #888;
    letter-spacing: .03em;
  }
  .page-footer strong { color: ${DGRAY}; }

  /* ── Bottom rules ── */
  .bot-accent { height: 2mm; background: ${ORANGE}; }
  .bot-rule   { height: 5mm; background: ${NAVY};   }

  /* ── Print FAB ── */
  .fab {
    position: fixed; bottom: 20px; right: 20px;
    background: ${NAVY}; color: #fff;
    border: none; border-radius: 8px;
    padding: 11px 22px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 18px rgba(0,32,96,.4);
    z-index: 9999; transition: background .15s;
  }
  .fab:hover { background: #003db5; }
</style>
</head>
<body>

  <!-- Navy + orange top bars -->
  <div class="top-rule"></div>
  <div class="top-accent"></div>

  <div class="page-body">

    <!-- Institution name -->
    <div class="inst-block">
      <div class="inst-name">Sri Lanka Institute of Information Technology</div>
      <div class="inst-sub">${esc(f.fac || 'Faculty of Computing')} &nbsp;·&nbsp; Malabe, Sri Lanka</div>
    </div>

    <!-- Logo -->
    <div class="logo-block">${logoBlock}</div>

    <!-- Primary rule -->
    <div class="rule"></div>

    <!-- Report type -->
    <div class="report-type-label">${esc(f.type)}</div>

    <!-- Report title — the hero element -->
    <div class="report-title">${esc(f.title)}</div>

    <!-- Secondary rule -->
    <div class="rule-thin"></div>

    <!-- Info grid -->
    <div class="info-section" style="margin-top:6mm;">
      <div class="info-header">Report Information</div>
      <table class="info-table">
        <tbody>${tableBody}</tbody>
      </table>
    </div>

    <div class="spacer"></div>

    <!-- Footer -->
    <div class="page-footer">
      <strong>Sri Lanka Institute of Information Technology</strong> &nbsp;|&nbsp;
      ${esc(f.fac || 'Faculty of Computing')} &nbsp;|&nbsp;
      www.sliit.lk
    </div>

  </div><!-- /page-body -->

  <!-- Bottom accent -->
  <div class="bot-accent"></div>
  <div class="bot-rule"></div>

  <!-- Screen-only print button -->
  <button class="fab no-print" onclick="window.print()">🖨&nbsp; Save as PDF</button>

</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
//  DOCX — header/footer colour bars using paragraph shading
//  (no tables in header = no resize handles, true full-width fill)
// ══════════════════════════════════════════════════════════════
async function buildDocx(f) {
  const {
    Document, Packer, Paragraph, TextRun, ImageRun,
    Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
    convertInchesToTwip
  } = docx;

  const NAVY   = '002060';
  const ORANGE = 'E8690A';
  const WHITE  = 'FFFFFF';
  const DGRAY  = '4A5A78';

  // Page geometry in DXA
  const PAGE_W    = 11906;  // A4 width
  const PAGE_H    = 16838;  // A4 height
  const MARGIN_LR = 1260;   // 0.875 in — used as indent on body paragraphs
  const PAD = { left: MARGIN_LR, right: MARGIN_LR };

  // ── Border helpers ──
  const bS    = (c, sz) => ({ style: BorderStyle.SINGLE, size: sz || 4, color: c });
  const bNone = { style: BorderStyle.NONE, size: 0, color: WHITE };
  const allNone = { top: bNone, bottom: bNone, left: bNone, right: bNone };
  const tblBordersNone = {
    top: bNone, bottom: bNone, left: bNone, right: bNone,
    insideH: bNone, insideV: bNone,
  };

  // ── Full-width solid colour bar (body-level, page margin = 0 so no indent needed) ──
  const solidBar = (colour, heightPt) => new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    columnWidths: [PAGE_W],
    borders: tblBordersNone,
    rows: [new TableRow({
      height: { value: heightPt * 20, rule: 'exact' },
      children: [new TableCell({
        borders: allNone,
        shading: { fill: colour, color: colour, type: ShadingType.SOLID },
        width: { size: PAGE_W, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: '', size: 2 })]
        })]
      })]
    })]
  });

  // ── Paragraph helpers (all indented so text sits inside the visual margin) ──
  const ctr = (text, size, bold, color, after) => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: after !== undefined ? after : 80 },
    indent: PAD,
    children: [new TextRun({ text: text || '', size, bold: !!bold,
      color: color || '000000', font: 'Arial' })]
  });
  const gap = pt => new Paragraph({
    spacing: { before: 0, after: 0 },
    indent: PAD,
    children: [new TextRun({ text: '', size: pt * 2, font: 'Arial' })]
  });
  const rule = () => new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 1 } },
    spacing: { before: 80, after: 80 },
    indent: PAD,
    children: [new TextRun({ text: ' ', size: 4 })]
  });

  // ════════════════════════════════════════════════════
  //  Body children  (top bars → content → spacer → footer text → bottom bars)
  // ════════════════════════════════════════════════════
  const children = [];

  // ── TOP bars ──
  children.push(solidBar(NAVY,   22));
  children.push(solidBar(ORANGE,  6));
  children.push(gap(10));  // breathing room below header

  // ── Logo ──
  if (f.logo) {
    try {
      const img = await fetchImgBuf(f.logo);
      if (!img) throw new Error('no data');
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 240 },
        indent: PAD,
        children: [new ImageRun({ data: img.data,
          transformation: { width: 110, height: 110 }, type: img.type })]
      }));
    } catch {
      children.push(ctr('[SLIIT Logo]', 24, false, DGRAY, 240));
    }
  } else {
    children.push(ctr('[SLIIT Logo — upload in extension]', 20, false, DGRAY, 240));
  }

  // ── University name + faculty ──
  children.push(ctr('SRI LANKA INSTITUTE OF INFORMATION TECHNOLOGY', 26, true, NAVY, 60));
  children.push(ctr((f.fac || 'Faculty of Computing') + '  \u00B7  Malabe, Sri Lanka',
    18, false, DGRAY, 140));
  children.push(rule());

  // ── Report type ──
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 60 },
    indent: PAD,
    children: [new TextRun({ text: (f.type || '').toUpperCase(),
      size: 18, bold: true, color: DGRAY, font: 'Arial' })]
  }));

  // ── Report title ──
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 180 },
    indent: PAD,
    children: [new TextRun({ text: f.title || '',
      size: 44, bold: true, color: NAVY, font: 'Times New Roman' })]
  }));

  children.push(rule());
  children.push(gap(6));

  // ── Info table ──
  const infoRows = [
    ['Module Code',          f.code],
    ['Module Name',          f.mod],
    ['Faculty',              f.fac],
    ['Lecturer / Supervisor',f.lect],
    ['Student Name',         f.name],
    ['Student ID',           f.id],
    ['Index Number',         f.idx],
    ['Degree Programme',     f.deg],
    ['Academic Year',        f.sem],
    ['Group / Batch',        f.grp],
    ['Lab Group',            f.lab],
    ['Date of Submission',   f.date],
  ].filter(r => r[1]);

  const COL_KEY  = 3000;
  const COL_VAL  = 6026;
  const TBL_W    = COL_KEY + COL_VAL;
  const allBorders = { top: bS(NAVY,8), bottom: bS(NAVY,8),
                       left: bS(NAVY,8), right: bS(NAVY,8) };

  const headerRow = new TableRow({
    children: [new TableCell({
      columnSpan: 2,
      borders: allBorders,
      shading: { fill: NAVY, color: 'auto', type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 180, right: 180 },
      children: [new Paragraph({
        children: [new TextRun({ text: 'REPORT INFORMATION',
          size: 18, bold: true, color: WHITE, font: 'Arial' })]
      })]
    })]
  });

  const dataRows = infoRows.map(([key, val], i) => new TableRow({
    children: [
      new TableCell({
        width: { size: COL_KEY, type: WidthType.DXA },
        borders: { top: bS('E0E4F0'), bottom: bS('E0E4F0'),
                   left: bS(NAVY,8),  right: bS('C0C8DC') },
        shading: { fill: i % 2 === 0 ? 'F0F2F8' : 'FAFBFE',
                   color: 'auto', type: ShadingType.CLEAR },
        margins: { top: 90, bottom: 90, left: 160, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [new TextRun({ text: key, size: 17, bold: true,
            color: DGRAY, font: 'Arial', allCaps: true })]
        })]
      }),
      new TableCell({
        width: { size: COL_VAL, type: WidthType.DXA },
        borders: { top: bS('E0E4F0'), bottom: bS('E0E4F0'),
                   left: bS('C0C8DC'), right: bS(NAVY,8) },
        shading: { fill: i % 2 === 0 ? WHITE : 'FAFBFE',
                   color: 'auto', type: ShadingType.CLEAR },
        margins: { top: 90, bottom: 90, left: 160, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [new TextRun({ text: String(val || ''),
            size: 21, color: '111111', font: 'Times New Roman' })]
        })]
      })
    ]
  }));

  children.push(new Table({
    width: { size: TBL_W, type: WidthType.DXA },
    indent: { size: MARGIN_LR, type: WidthType.DXA },
    columnWidths: [COL_KEY, COL_VAL],
    rows: [headerRow, ...dataRows]
  }));

  // ── Spacer (pushes footer toward the bottom of the A4 page) ──
  children.push(new Paragraph({
    spacing: { before: 5700, after: 0 },
    indent: PAD,
    children: [new TextRun({ text: '', size: 2 })]
  }));

  // ── Footer text ──
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 100 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: DGRAY, space: 4 } },
    indent: PAD,
    children: [
      new TextRun({ text: 'Sri Lanka Institute of Information Technology  |  ',
        size: 14, color: DGRAY, font: 'Arial' }),
      new TextRun({ text: (f.fac || 'Faculty of Computing') + '  |  www.sliit.lk',
        size: 14, color: DGRAY, font: 'Arial' }),
    ]
  }));

  // ── BOTTOM bars ──
  children.push(solidBar(ORANGE,  5));
  children.push(solidBar(NAVY,   14));

  // ── Document (zero margins so solidBars truly bleed to paper edge) ──
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 }
        }
      },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  dl(blob, 'SLIIT_Cover_' + (f.id || 'report') + '.docx');
}



async function fetchImgBuf(src) {
  if (src.startsWith('data:')) {
    const [hdr, b64] = src.split(',');
    const type = hdr.includes('png') ? 'png' : hdr.includes('gif') ? 'gif' : 'jpg';
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return { data: buf.buffer, type };
  }
  try {
    const res = await fetch(src);
    const data = await res.arrayBuffer();
    const ct = res.headers.get('content-type') || '';
    return { data, type: ct.includes('png') ? 'png' : ct.includes('gif') ? 'gif' : 'jpg' };
  } catch { return null; }
}

// ── RTF fallback ─────────────────────────────────────────────
function buildRTF(f) {
  const r = s => (s || '').replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}');
  const infoRows = [
    ['Module Code', f.code], ['Module Name', f.mod], ['Faculty', f.fac],
    ['Lecturer', f.lect], ['Student Name', f.name], ['Student ID', f.id],
    ['Index Number', f.idx], ['Degree Programme', f.deg], ['Academic Year', f.sem],
    ['Group / Batch', f.grp], ['Lab Group', f.lab], ['Date of Submission', f.date]
  ].filter(([, v]) => v)
    .map(([k, v]) => `{\\trowd\\trgaph80\\trrh360\\cellx2880\\cellx8640\\trql
{\\pard\\intbl\\f1\\fs17\\b\\cf2 ${r(k)}\\cell}
{\\pard\\intbl\\f0\\fs21 ${r(v)}\\cell}\\row}`).join('\n');

  const rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman Times New Roman;}{\\f1\\fswiss Arial;}}
{\\colortbl;\\red255\\green255\\blue255;\\red74\\green90\\blue120;\\red0\\green32\\blue96;\\red232\\green105\\blue10;}
\\paperw11906\\paperh16838\\margl1440\\margr1440\\margt1200\\margb1200
{\\pard\\qc\\f1\\fs26\\b\\cf3 SRI LANKA INSTITUTE OF INFORMATION TECHNOLOGY\\par}
{\\pard\\qc\\f1\\fs18\\cf2 ${r(f.fac || 'Faculty of Computing')}  ·  Malabe, Sri Lanka\\par}
\\pard\\qc\\brdrb\\brdrs\\brdrw12\\brdrcf3 \\par
{\\pard\\qc\\f1\\fs18\\b\\cf2 ${r((f.type || '').toUpperCase())}\\par}
{\\pard\\qc\\f0\\fs44\\b\\cf3 ${r(f.title || '')}\\par}
\\pard\\qc\\brdrb\\brdrs\\brdrw8\\brdrcf2 \\par\\par
${infoRows}
\\par
{\\pard\\qc\\brdrt\\brdrs\\brdrw6\\brdrcf2\\f1\\fs15\\cf2 Sri Lanka Institute of Information Technology  |  ${r(f.fac || 'Faculty of Computing')}  |  www.sliit.lk\\par}
}`;
  dl(new Blob([rtf], { type: 'application/rtf' }),
    `SLIIT_Cover_${f.id || 'report'}.rtf`);
}
