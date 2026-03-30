// js/player.js
// Initialises all interactive behaviour for a video player instance.
// Call initPlayer(pid) after the player HTML has been injected into the DOM.

import { ic } from './icons.js';

export function initPlayer(pid) {
  const v       = document.getElementById('vid_'   + pid);
  const ctrl    = document.getElementById('pctrl_' + pid);
  const seek    = document.getElementById('seek_'  + pid);
  const buf     = document.getElementById('pbuf_'  + pid);
  const timeEl  = document.getElementById('ptime_' + pid);
  const pbtn    = document.getElementById('pbtn_'  + pid);
  const bp      = document.getElementById('bp_'    + pid);
  const muteBtn = document.getElementById('mbtn_'  + pid);
  const volEl   = document.getElementById('vol_'   + pid);
  const marks   = document.getElementById('marks_' + pid);

  if (!v) return;

  let hideTimer;
  let isMuted = false;

  /* ── Control visibility ── */
  const showCtrl = () => {
    ctrl.style.opacity = '1';
    clearTimeout(hideTimer);
    if (!v.paused) hideTimer = setTimeout(() => { ctrl.style.opacity = '0'; }, 2800);
  };
  v.parentElement.addEventListener('mousemove',  showCtrl);
  v.parentElement.addEventListener('mouseleave', () => { if (!v.paused) ctrl.style.opacity = '0'; });

  /* ── Time formatter ── */
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /* ── Progress + buffer ── */
  v.addEventListener('timeupdate', () => {
    if (!v.duration) return;
    const p = (v.currentTime / v.duration) * 100;
    seek.value = p;
    seek.style.setProperty('--p', p + '%');
    timeEl.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`;
    if (v.buffered.length)
      buf.style.width = (v.buffered.end(v.buffered.length - 1) / v.duration * 100) + '%';
  });

  /* ── Metadata → chapter dots ── */
  v.addEventListener('loadedmetadata', () => {
    timeEl.textContent = `0:00 / ${fmt(v.duration)}`;
    if (marks) {
      const chapters = JSON.parse(marks.dataset.chs || '[]');
      marks.innerHTML = '';
      chapters.forEach(([t]) => {
        const d = document.createElement('div');
        d.className = 'ch-mark';
        d.style.left = (t / v.duration * 100) + '%';
        marks.appendChild(d);
      });
    }
  });

  /* ── Toggle play/pause ── */
  const togglePlay = () => {
    if (v.paused) {
      v.play().then(() => {
        bp.style.display = 'none';
        pbtn.innerHTML   = ic.pause;
        pbtn.classList.add('ac');
        showCtrl();
      }).catch(() => {});
    } else {
      v.pause();
      bp.style.display = 'flex';
      pbtn.innerHTML   = ic.play;
      pbtn.classList.remove('ac');
    }
  };

  v.addEventListener('click',  togglePlay);
  bp.addEventListener('click',  togglePlay);
  pbtn.addEventListener('click', togglePlay);
  v.addEventListener('ended', () => {
    bp.style.display = 'flex';
    pbtn.innerHTML   = ic.play;
    pbtn.classList.remove('ac');
  });

  /* ── Skip buttons ── */
  document.getElementById('sbtn_' + pid)
    .addEventListener('click', () => { v.currentTime = Math.max(0, v.currentTime - 10); });
  document.getElementById('sfwd_' + pid)
    .addEventListener('click', () => { v.currentTime = Math.min(v.duration || 0, v.currentTime + 10); });

  /* ── Seek bar ── */
  seek.addEventListener('input', e => {
    const val = +e.target.value;
    v.currentTime = (val / 100) * (v.duration || 0);
    e.target.style.setProperty('--p', val + '%');
  });

  /* ── Volume / mute ── */
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    v.muted = isMuted;
    muteBtn.innerHTML = isMuted ? ic.mute : ic.vol;
  });
  volEl.addEventListener('input', e => {
    v.volume = +e.target.value;
    e.target.style.setProperty('--p', (+e.target.value * 100) + '%');
  });

  /* ── Fullscreen ── */
  document.getElementById('fsbtn_' + pid).addEventListener('click', () => {
    const wrap = document.getElementById('pw_' + pid);
    if (!document.fullscreenElement) wrap.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  /* ── Keyboard shortcuts ── */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space')       { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowRight')  { v.currentTime = Math.min(v.duration || 0, v.currentTime + 10); }
    if (e.code === 'ArrowLeft')   { v.currentTime = Math.max(0, v.currentTime - 10); }
    if (e.code === 'KeyM')        { isMuted = !isMuted; v.muted = isMuted; muteBtn.innerHTML = isMuted ? ic.mute : ic.vol; }
  });
}
