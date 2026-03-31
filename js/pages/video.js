// js/pages/video.js  [PUBLIC — READ-ONLY]
// Returns HTML for Video Module pages.
// Fetches YouTube video ID and Drive URL from Supabase.
// Renders YouTube IFrame player or a clean placeholder.

import { ic }         from '../icons.js';
import { playerHTML } from '../components/player-html.js';
import { footerHTML } from '../components/footer.js';
import { getModule }  from '../supabase-db.js';
import { initYTPlayer } from '../yt-player.js';

const MODULE_DATA = {
  1: {
    ep:      'EPISODE 01',
    title:   'PRINCIPLES OF FLIGHT',
    desc:    'Introduction to the four fundamental forces — lift, drag, thrust, and weight.',
    chapters: [
      [0,   'Introduction'],
      [225, 'Four Forces'],
      [432, "Bernoulli's Principle"],
      [672, 'Wing Design'],
      [930, 'Case Study'],
    ],
  },
  2: {
    ep:      'EPISODE 02',
    title:   'AIRCRAFT SYSTEMS & AVIONICS',
    desc:    'Deep dive into hydraulics, fly-by-wire technology, and modern glass cockpit avionics.',
    chapters: [
      [0,    'Intro'],
      [250,  'Hydraulics'],
      [510,  'Electrical'],
      [720,  'Fly-by-Wire'],
      [1005, 'Glass Cockpits'],
    ],
  },
};

/**
 * @param {1|2} num - Module number
 */
export const videoPage = (num) => {
  const d   = MODULE_DATA[num];

  return `
<div class="page-in">
  <div class="vpage">

    <!-- ── Page header ─────────────────────── -->
    <div class="vp-topbar">
      <div class="vp-ep-block">
        <div class="vp-ep-num">0${num}</div>
      </div>
      <div class="vp-header-r">
        <div class="vp-ep-label">LEARNING MODULE · ${d.ep}</div>
        <h1 class="vp-title">${d.title}</h1>
        <p class="vp-desc">${d.desc}</p>
      </div>
    </div>

    <div style="padding:var(--sp-l) var(--pad)">

      <!-- ── Video area (populated by initVideoPage) ── -->
      <div id="video_area_${num}">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;
                    min-height:400px;background:rgba(255,107,0,.03);border:1px solid var(--c-rule)">
          <style>@keyframes pulsedot{0%,100%{opacity:.3}50%{opacity:1}}</style>
          <div style="width:8px;height:8px;background:#FF6B00;animation:pulsedot 1.5s ease infinite"></div>
          <span style="font-family:var(--f-mono);font-size:11px;letter-spacing:.2em;color:var(--c-dim)">
            LOADING MODULE…
          </span>
        </div>
      </div>

      <!-- Keyboard hints (shown after load) -->
      <div class="kbhint-row" id="kbhints_${num}" style="display:none">
        <div class="kbhint"><kbd>Space</kbd><span>Play / Pause</span></div>
        <div class="kbhint"><kbd>← →</kbd><span>Skip 10s</span></div>
        <div class="kbhint"><kbd>M</kbd><span>Mute / Unmute</span></div>
      </div>

      <!-- Download section (shown after load if Drive URL exists) -->
      <div id="dl_section_${num}" style="display:none;margin-top:var(--sp-l);
           display:none;flex-wrap:wrap;gap:12px;align-items:center">
        <a href="#" id="dl_btn_p${num}" download="airnova-module-${num}"
           class="o-btn" style="text-decoration:none">
          ${ic.dl} DOWNLOAD VIDEO
        </a>
      </div>

    </div>
  </div>

  ${footerHTML()}
</div>`;
};

/**
 * Async initialiser — called after videoPage HTML is in the DOM.
 * Fetches module data from Supabase, renders YouTube player or placeholder.
 * @param {1|2} num - Module number
 */
export async function initVideoPage(num) {
  const d   = MODULE_DATA[num];
  const pid = 'p' + num;
  const moduleId = num === 1 ? 'v1' : 'v2';
  const area = document.getElementById('video_area_' + num);
  if (!area) return;

  try {
    const data = await getModule(moduleId);

    if (data && data.yt_video_id) {
      /* ── YouTube video exists → render player ── */
      area.innerHTML = playerHTML(pid, d.chapters);

      /* Show keyboard hints */
      const hints = document.getElementById('kbhints_' + num);
      if (hints) hints.style.display = '';

      /* Init YouTube player */
      await initYTPlayer(pid, data.yt_video_id, d.chapters);

      /* Download button */
      if (data.drive_download_url) {
        const dlSection = document.getElementById('dl_section_' + num);
        const dlBtn     = document.getElementById('dl_btn_' + pid);
        if (dlSection) dlSection.style.display = 'flex';
        if (dlBtn) dlBtn.href = data.drive_download_url;
      }

    } else {
      /* ── No YouTube video → placeholder ── */
      const title = (data && data.title) ? data.title : d.title;
      showPlaceholder(area, d.ep, title);
    }

  } catch (err) {
    console.error('[Video] initVideoPage failed:', err);
    showPlaceholder(area, d.ep, d.title);
  }
}

/** Render a clean "Content coming soon" placeholder panel */
function showPlaceholder(container, ep, title) {
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                min-height:400px;background:rgba(255,107,0,.03);border:1px solid var(--c-rule);
                gap:16px;padding:40px">
      <div style="font-family:var(--f-mono);font-size:9px;letter-spacing:.3em;
                  color:var(--c-orange)">${ep}</div>
      <div style="font-family:var(--f-display);font-size:clamp(1.4rem,3vw,2rem);
                  font-weight:800;letter-spacing:-.01em;text-align:center;
                  color:var(--c-text)">${title}</div>
      <div style="width:40px;height:1px;background:var(--c-rule);margin:8px 0"></div>
      <div style="font-family:var(--f-mono);font-size:11px;letter-spacing:.18em;
                  color:var(--c-dim)">CONTENT COMING SOON</div>
    </div>`;
}
