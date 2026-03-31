// js/upload.js
// Handles video file upload via drag-and-drop or file picker.
// Exposes handleDrop, handleFile, setUpUI, resetDefault on window.

import { ic } from './icons.js';

const DFLT = '';

/** Update the upload zone UI based on current state. */
export function setUpUI(pid, state, name = '', sub = '') {
  const iEl = document.getElementById('uicon_' + pid);
  const nEl = document.getElementById('uname_' + pid);
  const sEl = document.getElementById('usub_'  + pid);
  if (!iEl) return;

  const spinnerHTML = `<div style="width:18px;height:18px;border:2px solid #FF6B00;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite"></div>`;

  const icons   = { idle: ic.up, load: spinnerHTML, ok: ic.ok, err: ic.err, change: ic.up };
  const names   = { idle: 'Upload / Change Video', change: 'Change Video' };
  const subs    = { idle: 'Drag & drop or click  ·  MP4, MOV, WEBM, AVI',
                    change: 'Drag & drop or click  ·  MP4, MOV, WEBM, AVI' };

  iEl.innerHTML  = icons[state]  || icons.idle;
  nEl.textContent = name  || names[state]  || names.idle;
  sEl.textContent = sub !== undefined ? sub : (subs[state] || subs.idle);
}

/** Process a dropped or selected File object. */
export function handleFile(file, pid) {
  if (!file) return;

  if (!file.type.startsWith('video/')) {
    setUpUI(pid, 'err', 'Invalid file — video files only', '');
    setTimeout(() => setUpUI(pid, 'idle'), 2800);
    return;
  }

  setUpUI(pid, 'load', 'Processing…', '');
  const url = URL.createObjectURL(file);

  setTimeout(() => {
    const v = document.getElementById('vid_' + pid);
    if (v) { v.pause(); v.src = url; v.load(); }

    const dl = document.getElementById('dl_btn_' + pid);
    if (dl) {
      dl.href = url;
      dl.download = file.name;
    }

    setUpUI(pid, 'ok', 'Loaded: ' + file.name, 'Custom video active');

    const badge = document.getElementById('cbadge_' + pid);
    if (badge) badge.style.display = 'block';

    const rb = document.getElementById('rb_' + pid);
    if (rb) rb.style.display = 'inline-flex';

    setTimeout(() => setUpUI(pid, 'change'), 3200);
  }, 650);
}

/** ondrop handler — called inline from upload HTML. */
export function handleDrop(e, pid) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag');
  handleFile(e.dataTransfer.files[0], pid);
}

/** Restore the player to the default demo video. */
export function resetDefault(pid) {
  const v = document.getElementById('vid_' + pid);
  if (v) { v.pause(); v.src = DFLT; v.load(); }

  const dl = document.getElementById('dl_btn_' + pid);
  if (dl) {
    dl.href = '#';
    dl.download = '';
  }

  const badge = document.getElementById('cbadge_' + pid);
  if (badge) badge.style.display = 'none';

  const rb = document.getElementById('rb_' + pid);
  if (rb) rb.style.display = 'none';

  setUpUI(pid, 'idle');
}
