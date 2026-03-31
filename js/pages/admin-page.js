// js/pages/admin-page.js
// Admin dashboard controller — module data management.
// This file is NEVER imported by the public build (main.js).

import { ic }              from '../icons.js';
import { playerHTML }      from '../components/player-html.js';
import { footerHTML }      from '../components/footer.js';
import { LOGO }            from '../logo.js';
import { initAdminInputs } from '../admin-upload.js';
import { initYTPlayer }    from '../yt-player.js';

const MODULE_DATA = {
  m1: {
    num:   1,
    ep:    'EPISODE 01',
    title: 'PRINCIPLES OF FLIGHT',
    desc:  'Set the YouTube video ID and Google Drive download URL for this module.',
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
    desc:  'Set the YouTube video ID and Google Drive download URL for this module.',
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
const PDF_SRC = '';

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
    SUPABASE · CLOUD SYNC ACTIVE
  </div>
</div>`;

/* ── Admin input panel for module data ──── */
const adminInputPanel = (pid) => `
<div style="margin-top:var(--sp-xl)">
  <div class="label" style="margin-bottom:6px">MODULE DATA</div>
  <p style="font-family:var(--f-mono);font-size:11px;color:var(--c-faint);
            letter-spacing:.08em;margin-bottom:20px;line-height:1.7">
    Set the YouTube video ID and Google Drive download URL for this module.
    Changes are saved to Supabase and reflected on the public site immediately.
  </p>

  <!-- YouTube Video ID -->
  <div style="margin-bottom:16px">
    <div style="font-family:var(--f-mono);font-size:9px;letter-spacing:.22em;
                color:var(--c-orange);margin-bottom:8px;display:flex;align-items:center;gap:8px">
      <span style="width:18px;height:1px;background:var(--c-orange);display:inline-block"></span>
      YOUTUBE VIDEO ID
    </div>
    <input type="text" id="yt_input_${pid}"
           placeholder="dQw4w9WgXcQ"
           style="width:100%;background:rgba(255,255,255,.03);border:1px solid var(--c-rule);
                  color:var(--c-text);font-family:var(--f-mono);font-size:13px;
                  letter-spacing:.08em;padding:14px 16px;outline:none;
                  transition:border-color .2s,background .2s"
           onfocus="this.style.borderBottomColor='var(--c-orange)';this.style.background='rgba(255,107,0,.04)'"
           onblur="this.style.borderBottomColor='';this.style.background='rgba(255,255,255,.03)'" />
  </div>

  <!-- Google Drive Download URL -->
  <div style="margin-bottom:20px">
    <div style="font-family:var(--f-mono);font-size:9px;letter-spacing:.22em;
                color:var(--c-orange);margin-bottom:8px;display:flex;align-items:center;gap:8px">
      <span style="width:18px;height:1px;background:var(--c-orange);display:inline-block"></span>
      DRIVE DOWNLOAD URL
    </div>
    <input type="text" id="drive_input_${pid}"
           placeholder="https://drive.google.com/uc?export=download&amp;id=FILE_ID"
           style="width:100%;background:rgba(255,255,255,.03);border:1px solid var(--c-rule);
                  color:var(--c-text);font-family:var(--f-mono);font-size:13px;
                  letter-spacing:.08em;padding:14px 16px;outline:none;
                  transition:border-color .2s,background .2s"
           onfocus="this.style.borderBottomColor='var(--c-orange)';this.style.background='rgba(255,107,0,.04)'"
           onblur="this.style.borderBottomColor='';this.style.background='rgba(255,255,255,.03)'" />
  </div>

  <!-- Save button -->
  <button class="o-btn" onclick="window.saveModuleData('${pid}')">
    SAVE CHANGES →
  </button>

  <!-- Status row -->
  <div id="save_status_${pid}" style="margin-top:12px;min-height:24px;
       font-family:var(--f-mono);font-size:10px;letter-spacing:.14em"></div>
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

      <!-- ── ADMIN: Module data input panel ───────── -->
      ${adminInputPanel(pid)}

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
          <a href="#" download="airnova-report.pdf" target="_blank" id="dl_pdf_btn"
             class="o-btn" style="text-decoration:none">
            ${ic.dl} DOWNLOAD REPORT
          </a>
        </div>
        <iframe src="${PDF_SRC ? PDF_SRC + '#toolbar=0&navpanes=0' : 'about:blank'}" title="PDF Viewer"
                style="width:100%;height:620px;border:none;display:block;background:#111">
        </iframe>
      </div>
    </div>
  </div>

  ${footerHTML()}
</div>`;
};

/* ── Main export ────────────────────────── */
/**
 * @param {'m1'|'m2'|'pdf'} panel
 * @returns {string} HTML string for the requested admin panel
 */
export const adminPage = (panel) => {
  let html;
  let pid;
  let chapters;
  switch (panel) {
    case 'm1':  html = videoAdminPanel('m1'); pid = 'p1'; chapters = MODULE_DATA.m1.chapters; break;
    case 'm2':  html = videoAdminPanel('m2'); pid = 'p2'; chapters = MODULE_DATA.m2.chapters; break;
    case 'pdf': html = pdfAdminPanel();                    break;
    default:    html = videoAdminPanel('m1'); pid = 'p1'; chapters = MODULE_DATA.m1.chapters;
  }

  /* Init admin inputs + YouTube preview after DOM update */
  if (pid) {
    setTimeout(async () => {
      try {
        const data = await initAdminInputs(pid);
        if (data && data.yt_video_id) {
          await initYTPlayer(pid, data.yt_video_id, chapters);
        }
      } catch (err) {
        console.error('[Admin] Panel init failed:', err);
      }
    }, 60);
  }

  return html;
};
