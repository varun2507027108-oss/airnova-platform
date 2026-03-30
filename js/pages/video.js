// js/pages/video.js  [PUBLIC — READ-ONLY]
// Returns HTML for Video Module pages.
// Upload zone and restore button have been removed from this build.
// All upload functionality lives exclusively in js/pages/admin-page.js.

import { ic }         from '../icons.js';
import { playerHTML } from '../components/player-html.js';
import { footerHTML } from '../components/footer.js';

const DFLT = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4';

const MODULE_DATA = {
  1: {
    ep:      'EPISODE 01',
    title:   'PRINCIPLES OF FLIGHT',
    desc:    'Introduction to the four fundamental forces — lift, drag, thrust, and weight.',
    chapters: [
      [0,   'Introduction'],
      [225, 'Four Forces'],
      [432, 'Bernoulli\'s Principle'],
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
  const pid = 'p' + num;

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

      <!-- ── Player ──────────────────────── -->
      ${playerHTML(pid, d.chapters)}

      <!-- Keyboard hints -->
      <div class="kbhint-row">
        <div class="kbhint"><kbd>Space</kbd><span>Play / Pause</span></div>
        <div class="kbhint"><kbd>← →</kbd><span>Skip 10s</span></div>
        <div class="kbhint"><kbd>M</kbd><span>Mute / Unmute</span></div>
      </div>

      <!-- ── Download only (no upload) ──────── -->
      <div style="margin-top:var(--sp-l);display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <a href="${DFLT}" download="airnova-module-${num}.mp4"
           class="o-btn" style="text-decoration:none">
          ${ic.dl} DOWNLOAD VIDEO
        </a>
      </div>

    </div>
  </div>

  ${footerHTML()}
</div>`;
};
