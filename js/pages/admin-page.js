// js/pages/admin-page.js
// Admin dashboard controller — ALL upload logic lives here.
// This file is NEVER imported by the public build (main.js).
// It is only dynamically imported by admin-main.js after authentication.

import { ic }         from '../icons.js';
import { playerHTML } from '../components/player-html.js';
import { uploadHTML } from '../components/upload-html.js';
import { footerHTML } from '../components/footer.js';
import { LOGO }       from '../logo.js';
import { initPlayer } from '../player.js';
import { handleFile, handleDrop, setUpUI, resetDefault } from '../upload.js';

/* ── Expose upload handlers on window so inline HTML onclick/onchange can call them ── */
window.handleFile   = handleFile;
window.handleDrop   = handleDrop;
window.setUpUI      = setUpUI;
window.resetDefault = resetDefault;

const DFLT = '';

const MODULE_DATA = {
  m1: {
    num:   1,
    ep:    'EPISODE 01',
    title: 'PRINCIPLES OF FLIGHT',
    desc:  'Introduction to the four fundamental forces — lift, drag, thrust, and weight. Upload the lecture video for this module below.',
    chapters: [
      [0,   'Introduction'],
      [225, 'Four Forces'],
      [432, "Bernoulli's Principle"],
      [672, 'Wing Design'],
      [930, 'Case Study'],
    ],
  },
  m2: {
    num:   2,
    ep:    'EPISODE 02',
    title: 'AIRCRAFT SYSTEMS & AVIONICS',
    desc:  'Deep dive into hydraulics, fly-by-wire technology, and modern glass cockpit avionics. Upload the lecture video for this module below.',
    chapters: [
      [0,    'Intro'],
      [250,  'Hydraulics'],
      [510,  'Electrical'],
      [720,  'Fly-by-Wire'],
      [1005, 'Glass Cockpits'],
    ],
  },
};

/* ── PDF Resource page (admin view) ─────── */
const PDF_SRC = 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf';



/* ── Admin status bar ───────────────────── */
const adminStatusBar = (activePanel) => `
<div style="
  background: rgba(255,107,0,.05);
  border-bottom: 1px solid rgba(255,107,0,.15);
  padding: 10px var(--pad);
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
">
  <div style="display:flex;align-items:center;gap:7px">
    <div style="width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80"></div>
    <span style="font-family:var(--f-mono);font-size:9px;letter-spacing:.2em;color:#4ade80">ADMIN SESSION ACTIVE</span>
  </div>
  <div style="font-family:var(--f-mono);font-size:9px;letter-spacing:.16em;color:var(--c-faint)">
    PANEL · ${activePanel.toUpperCase()}
  </div>
  <div style="margin-left:auto;font-family:var(--f-mono);font-size:9px;letter-spacing:.14em;color:var(--c-faint)">
    CHANGES ARE SESSION-LOCAL · CLOUD SYNC READY
  </div>
</div>`;

/* ── Video module admin panel ───────────── */
const videoAdminPanel = (key) => {
  const d   = MODULE_DATA[key];
  const pid = 'p' + d.num;

  return `
<div class="page-in">
  ${adminStatusBar(d.ep)}

  <div class="vpage">
    <div class="vp-topbar">
      <div class="vp-ep-block">
        <div class="vp-ep-num">0${d.num}</div>
      </div>
      <div class="vp-header-r">
        <div class="vp-ep-label">ADMIN · ${d.ep}</div>
        <h1 class="vp-title">${d.title}</h1>
        <p class="vp-desc">${d.desc}</p>
      </div>
    </div>

    <div style="padding:var(--sp-l) var(--pad)">

      <!-- Player preview -->
      ${playerHTML(pid, d.chapters)}

      <div class="kbhint-row">
        <div class="kbhint"><kbd>Space</kbd><span>Play / Pause</span></div>
        <div class="kbhint"><kbd>← →</kbd><span>Skip 10s</span></div>
        <div class="kbhint"><kbd>M</kbd><span>Mute / Unmute</span></div>
      </div>

      <!-- ── ADMIN: Upload zone ───────── -->
      <div style="margin-top:var(--sp-xl)">
        <div class="label" style="margin-bottom:6px">UPLOAD / CHANGE VIDEO</div>
        <p style="font-family:var(--f-mono);font-size:11px;color:var(--c-faint);
                  letter-spacing:.08em;margin-bottom:14px;line-height:1.7">
          Replace the module video. Accepted formats: MP4, MOV, WEBM, AVI.
          Video is stored as a local object URL — wire to Cloudinary or Firebase Storage for persistence.
        </p>
        ${uploadHTML(pid)}
      </div>

      <!-- ── ADMIN: Action row ─────────── -->
      <div style="margin-top:var(--sp-l);display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <a href="#" id="dl_btn_${pid}" download="airnova-module-${d.num}.mp4"
           class="o-btn" style="text-decoration:none">
          ${ic.dl} DOWNLOAD VIDEO
        </a>
        <button id="rb_${pid}" onclick="window.resetDefault('${pid}')"
          style="display:none;align-items:center;gap:7px;
                 background:transparent;
                 border:1px solid var(--c-rule);
                 color:var(--c-dim);
                 padding:12px 20px;
                 font-family:var(--f-mono);font-size:10px;letter-spacing:.16em;
                 transition:border-color .2s,color .2s">
          ${ic.rst} RESTORE DEFAULT
        </button>
      </div>

      <!-- ── ADMIN: Cloud sync notice ──── -->
      <div style="
        margin-top:var(--sp-l);
        border:1px solid rgba(255,107,0,.15);
        background:rgba(255,107,0,.04);
        padding:16px 20px;
        display:flex; align-items:flex-start; gap:14px;
      ">
        <div style="color:var(--c-orange);margin-top:1px;flex-shrink:0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <div style="font-family:var(--f-mono);font-size:10px;font-weight:700;
                      letter-spacing:.16em;color:var(--c-orange);margin-bottom:5px">
            CLOUD SYNC — INTEGRATION POINT
          </div>
          <p style="font-family:var(--f-mono);font-size:11px;color:var(--c-faint);
                    line-height:1.75;letter-spacing:.04em">
            Current uploads create a local <code style="color:var(--c-dim)">ObjectURL</code>.
            For persistent hosting, replace <code style="color:var(--c-dim)">URL.createObjectURL(file)</code>
            in <code style="color:var(--c-dim)">js/upload.js → handleFile()</code>
            with a Cloudinary upload or a Firebase Storage <code style="color:var(--c-dim)">put()</code> call
            and return the resulting CDN URL instead.
          </p>
        </div>
      </div>

    </div>
  </div>

  ${footerHTML()}
</div>`;
};

/* ── PDF admin panel ────────────────────── */
const pdfAdminPanel = () => {
  return `
<div class="page-in">
  ${adminStatusBar('PDF Resources')}

  <div class="pdf-page">
    <div class="pdf-topbar">
      <div>
        <div class="label">ADMIN · KNOWLEDGE BASE</div>
        <h1 class="h-display" style="font-size:clamp(2rem,4vw,3.5rem);margin-top:12px">
          PDF RESOURCE CENTER
        </h1>
        <p style="font-size:13px;color:var(--c-dim);line-height:1.75;margin-top:10px;max-width:500px">
          Manage official reports, technical manuals, and reference documents.
        </p>
      </div>
    </div>

    <div style="padding:var(--sp-l) var(--pad)">
      <div class="pdf-shell">
        <div class="pdf-toolbar">
          <div class="pdf-meta-row">
            <div class="pdf-icon">${ic.pdf}</div>
            <div>
              <div class="pdf-fname">AIRNOVA_Technical_Report_2025.pdf</div>
              <div class="pdf-fmeta">20 PAGES · 2.4 MB · FLAGSHIP DOCUMENT</div>
            </div>
          </div>
          <a href="${PDF_SRC}" download="airnova-report.pdf" target="_blank"
             class="o-btn" style="text-decoration:none">
            ${ic.dl} DOWNLOAD REPORT
          </a>
        </div>
        <iframe src="${PDF_SRC}#toolbar=0&navpanes=0" title="PDF Viewer"
                style="width:100%;height:620px;border:none;display:block;background:#111">
        </iframe>
      </div>

      <!-- ── ADMIN: PDF upload zone ──── -->
      <div style="margin-top:var(--sp-xl)">
        <div class="label" style="margin-bottom:6px">REPLACE FEATURED PDF</div>
        <p style="font-family:var(--f-mono);font-size:11px;color:var(--c-faint);
                  letter-spacing:.08em;margin-bottom:14px;line-height:1.7">
          Upload a new PDF to replace the featured document in the viewer above.
          Changes are session-local; wire to a cloud bucket for persistence.
        </p>
        <!-- PDF file picker — uses upload zone styles -->
        <div class="upload-zone" id="uz_pdf"
          onclick="document.getElementById('uf_pdf').click()"
          ondragover="event.preventDefault();this.classList.add('drag')"
          ondragleave="this.classList.remove('drag')"
          ondrop="window._handlePdfDrop(event)">
          <input type="file" accept="application/pdf" id="uf_pdf" style="display:none"
                 onchange="window._handlePdfFile(this.files[0])"/>
          <div class="up-icon" id="uicon_pdf">
            ${ic.pdf}
          </div>
          <div style="flex:1;min-width:160px">
            <div class="up-name" id="uname_pdf">Upload / Replace PDF</div>
            <div class="up-sub"  id="usub_pdf">Drag &amp; drop or click · PDF only</div>
          </div>
          <span class="ftag">PDF</span>
        </div>
      </div>
    </div>
  </div>

  ${footerHTML()}
</div>`;
};

/* ── PDF file handler (admin-local) ─────── */
function initPdfHandlers() {
  window._handlePdfFile = (file) => {
    if (!file || file.type !== 'application/pdf') {
      document.getElementById('uname_pdf').textContent = 'Invalid — PDF files only';
      return;
    }
    const url = URL.createObjectURL(file);
    const iframe = document.querySelector('.pdf-shell iframe');
    if (iframe) iframe.src = url + '#toolbar=0&navpanes=0';
    document.getElementById('uname_pdf').textContent = 'Loaded: ' + file.name;
    document.getElementById('usub_pdf').textContent  = 'PDF active in viewer above';
    document.getElementById('uicon_pdf').innerHTML   =
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>`;
  };

  window._handlePdfDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag');
    window._handlePdfFile(e.dataTransfer.files[0]);
  };
}

/* ── Main export ────────────────────────── */
/**
 * @param {'m1'|'m2'|'pdf'} panel
 * @returns {string} HTML string for the requested admin panel
 */
export const adminPage = (panel) => {
  let html;
  let pid;
  switch (panel) {
    case 'm1':  html = videoAdminPanel('m1'); pid = 'p1'; break;
    case 'm2':  html = videoAdminPanel('m2'); pid = 'p2'; break;
    case 'pdf': html = pdfAdminPanel();                    break;
    default:    html = videoAdminPanel('m1'); pid = 'p1';
  }

  // Init player controls after the DOM has been updated
  if (pid) {
    setTimeout(() => initPlayer(pid), 60);
  }

  // Init PDF-specific handlers after render
  if (panel === 'pdf') {
    setTimeout(initPdfHandlers, 60);
  }

  return html;
};
