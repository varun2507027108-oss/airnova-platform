// js/components/upload-html.js
// Returns the HTML markup for the drag-and-drop video upload zone.
// Upload logic lives in js/upload.js.

import { ic } from '../icons.js';

/**
 * @param {string} pid - Must match the player id this uploader controls
 */
export const uploadHTML = (pid) => `
<div class="upload-zone" id="uz_${pid}"
  onclick="document.getElementById('uf_${pid}').click()"
  ondragover="event.preventDefault(); this.classList.add('drag')"
  ondragleave="this.classList.remove('drag')"
  ondrop="window.handleDrop(event, '${pid}')">

  <input type="file" accept="video/*" id="uf_${pid}" style="display:none"
    onchange="window.handleFile(this.files[0], '${pid}')">

  <!-- State icon -->
  <div class="up-icon" id="uicon_${pid}">${ic.up}</div>

  <!-- Text -->
  <div style="flex:1; min-width:160px">
    <div class="up-name" id="uname_${pid}">Upload / Change Video</div>
    <div class="up-sub"  id="usub_${pid}">Drag &amp; drop or click · MP4, MOV, WEBM, AVI</div>
  </div>

  <!-- Format tags -->
  <div style="display:flex; gap:5px; flex-wrap:wrap">
    <span class="ftag">MP4</span>
    <span class="ftag">MOV</span>
    <span class="ftag">WEBM</span>
    <span class="ftag">AVI</span>
  </div>

</div>`;
