// js/components/player-html.js
// Returns the HTML markup for a video player instance.
// initPlayer(pid) in player.js must be called after this is injected.

import { ic } from '../icons.js';

const DFLT = '';

/**
 * @param {string}   pid      - Unique player id, e.g. 'p1'
 * @param {Array}    chapters - Array of [timeSecs, label] pairs for dot markers
 */
export const playerHTML = (pid, chapters = []) => `
<div id="pw_${pid}" class="player-shell">

  <!-- HUD overlays -->
  <div class="p-overlay-tl">
    <span>AIRNOVA · ${pid.toUpperCase()}</span>
  </div>
  <div id="cbadge_${pid}" class="p-custom-badge" style="display:none">
    <span>● CUSTOM VIDEO</span>
  </div>
  <div class="p-overlay-tr">
    <span id="ptime_${pid}">0:00 / 0:00</span>
  </div>

  <!-- Scanline texture -->
  <div class="p-scan"></div>

  <!-- Video element -->
  <video id="vid_${pid}" src="${DFLT}"></video>

  <!-- Controls -->
  <div class="p-ctrl" id="pctrl_${pid}">

    <!-- Progress bar -->
    <div class="p-prog">
      <div class="p-buf-track">
        <div class="p-buf-fill" id="pbuf_${pid}" style="width:0"></div>
      </div>
      <input class="seek" type="range" min="0" max="100" step=".05"
             value="0" id="seek_${pid}" style="--p:0%">
      <!-- Chapter dot markers — populated by initPlayer -->
      <div id="marks_${pid}"
           data-chs='${JSON.stringify(chapters)}'
           style="position:absolute;inset:0;pointer-events:none">
      </div>
    </div>

    <!-- Button row -->
    <div class="ctrl-row">
      <button class="vb" id="sbtn_${pid}">${ic.sb}</button>
      <button class="vb" id="pbtn_${pid}">${ic.play}</button>
      <button class="vb" id="sfwd_${pid}">${ic.sf}</button>
      <button class="vb" id="mbtn_${pid}">${ic.vol}</button>
      <input  class="vol" type="range" min="0" max="1"
              step=".02" value="1" id="vol_${pid}" style="--p:100%">
      <span class="t-disp"></span>
      <div style="margin-left:auto">
        <button class="vb" id="fsbtn_${pid}">${ic.max}</button>
      </div>
    </div>

  </div><!-- /p-ctrl -->

  <!-- Centre play button (shown when paused) -->
  <button class="big-play" id="bp_${pid}">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#040404" style="margin-left:4px">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  </button>

</div>`;
