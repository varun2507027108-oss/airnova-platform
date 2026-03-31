// js/yt-player.js
// YouTube IFrame player controller.
// Maps all custom HUD controls to the YouTube Player API.
// Control IDs match the native player pattern so the rest of the codebase stays compatible.

import { ic } from './icons.js';

/* ── Wait for YouTube IFrame API ── */
function waitForYT(timeout = 8000) {
  return new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    const timer = setTimeout(() => reject(new Error('YT API timeout')), timeout);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      if (prev) prev();
      resolve();
    };
  });
}

/**
 * Initialise a YouTube IFrame player with full HUD controls.
 * @param {string}  pid        - Player ID prefix, e.g. 'p1'
 * @param {string}  ytVideoId  - YouTube video ID
 * @param {Array}   chapters   - [[timeSecs, label], ...]
 * @returns {Promise<YT.Player|null>}
 */
export async function initYTPlayer(pid, ytVideoId, chapters = []) {
  try {
    await waitForYT();
  } catch {
    showStreamError(pid);
    return null;
  }

  const ctrl    = document.getElementById('pctrl_' + pid);
  const seek    = document.getElementById('seek_'  + pid);
  const buf     = document.getElementById('pbuf_'  + pid);
  const timeEl  = document.getElementById('ptime_' + pid);
  const pbtn    = document.getElementById('pbtn_'  + pid);
  const bp      = document.getElementById('bp_'    + pid);
  const muteBtn = document.getElementById('mbtn_'  + pid);
  const volEl   = document.getElementById('vol_'   + pid);
  const marks   = document.getElementById('marks_' + pid);
  const pw      = document.getElementById('pw_'    + pid);

  if (!document.getElementById('ytc_' + pid)) return null;

  let hideTimer;
  let isMuted = false;
  let pollId  = null;
  let duration = 0;

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  /* ── Create YouTube player ── */
  const ytPlayer = new YT.Player('ytc_' + pid, {
    videoId: ytVideoId,
    playerVars: {
      controls:       0,
      disablekb:      1,
      modestbranding: 1,
      rel:            0,
      playsinline:    1,
      fs:             0,
      iv_load_policy: 3,
    },
    events: {
      onReady: (e) => {
        duration = e.target.getDuration();
        if (timeEl) timeEl.textContent = `0:00 / ${fmt(duration)}`;

        /* Style the iframe to fill the wrapper */
        const iframe = e.target.getIframe();
        iframe.style.position = 'absolute';
        iframe.style.top      = '0';
        iframe.style.left     = '0';
        iframe.style.width    = '100%';
        iframe.style.height   = '100%';

        /* Chapter dots */
        if (marks && duration > 0) {
          marks.innerHTML = '';
          chapters.forEach(([t]) => {
            const dot = document.createElement('div');
            dot.className = 'ch-mark';
            dot.style.left = (t / duration * 100) + '%';
            marks.appendChild(dot);
          });
        }
        startPolling();
      },
      onStateChange: (e) => {
        if (!pbtn || !bp) return;
        switch (e.data) {
          case YT.PlayerState.PLAYING:
            bp.style.display = 'none';
            pbtn.innerHTML   = ic.pause;
            pbtn.classList.add('ac');
            showCtrl();
            startPolling();
            break;
          case YT.PlayerState.PAUSED:
            bp.style.display = 'flex';
            pbtn.innerHTML   = ic.play;
            pbtn.classList.remove('ac');
            break;
          case YT.PlayerState.ENDED:
            bp.style.display = 'flex';
            pbtn.innerHTML   = ic.play;
            pbtn.classList.remove('ac');
            stopPolling();
            break;
        }
      },
      onError: () => { showStreamError(pid); }
    }
  });

  /* ── Polling for time + buffer ── */
  function startPolling() {
    stopPolling();
    pollId = setInterval(() => {
      try {
        if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
        const cur = ytPlayer.getCurrentTime();
        const dur = ytPlayer.getDuration() || duration;
        if (dur <= 0) return;
        const p = (cur / dur) * 100;
        if (seek) { seek.value = p; seek.style.setProperty('--p', p + '%'); }
        if (timeEl) timeEl.textContent = `${fmt(cur)} / ${fmt(dur)}`;
        if (buf) buf.style.width = (ytPlayer.getVideoLoadedFraction() * 100) + '%';
      } catch { /* player may be destroyed */ }
    }, 250);
  }
  function stopPolling() { if (pollId) { clearInterval(pollId); pollId = null; } }

  /* ── Control visibility ── */
  const showCtrl = () => {
    if (!ctrl) return;
    ctrl.style.opacity = '1';
    clearTimeout(hideTimer);
    try {
      if (ytPlayer && typeof ytPlayer.getPlayerState === 'function' &&
          ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        hideTimer = setTimeout(() => { ctrl.style.opacity = '0'; }, 2800);
      }
    } catch { /* ignore */ }
  };
  if (pw) {
    pw.addEventListener('mousemove',  showCtrl);
    pw.addEventListener('mouseleave', () => {
      try {
        if (ytPlayer && typeof ytPlayer.getPlayerState === 'function' &&
            ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
          ctrl.style.opacity = '0';
        }
      } catch { /* ignore */ }
    });
  }

  /* ── Toggle play/pause ── */
  const togglePlay = () => {
    try {
      if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
      const st = ytPlayer.getPlayerState();
      if (st === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    } catch { /* ignore */ }
  };
  if (bp)   bp.addEventListener('click',   togglePlay);
  if (pbtn) pbtn.addEventListener('click', togglePlay);

  /* ── Skip buttons ── */
  const sbtn = document.getElementById('sbtn_' + pid);
  const sfwd = document.getElementById('sfwd_' + pid);
  if (sbtn) sbtn.addEventListener('click', () => {
    try { ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 10), true); } catch {}
  });
  if (sfwd) sfwd.addEventListener('click', () => {
    try { ytPlayer.seekTo(Math.min(ytPlayer.getDuration(), ytPlayer.getCurrentTime() + 10), true); } catch {}
  });

  /* ── Seek bar ── */
  if (seek) seek.addEventListener('input', (e) => {
    try {
      const val = +e.target.value;
      ytPlayer.seekTo((val / 100) * (ytPlayer.getDuration() || 0), true);
      e.target.style.setProperty('--p', val + '%');
    } catch {}
  });

  /* ── Volume / mute ── */
  if (muteBtn) muteBtn.addEventListener('click', () => {
    try {
      isMuted = !isMuted;
      if (isMuted) ytPlayer.mute(); else ytPlayer.unMute();
      muteBtn.innerHTML = isMuted ? ic.mute : ic.vol;
    } catch {}
  });
  if (volEl) volEl.addEventListener('input', (e) => {
    try {
      ytPlayer.setVolume(+e.target.value * 100);
      e.target.style.setProperty('--p', (+e.target.value * 100) + '%');
    } catch {}
  });

  /* ── Fullscreen ── */
  const fsbtn = document.getElementById('fsbtn_' + pid);
  if (fsbtn) fsbtn.addEventListener('click', () => {
    if (!document.fullscreenElement) pw?.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  /* ── Keyboard shortcuts ── */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    try {
      if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight') { ytPlayer.seekTo(Math.min(ytPlayer.getDuration(), ytPlayer.getCurrentTime() + 10), true); }
      if (e.code === 'ArrowLeft')  { ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 10), true); }
      if (e.code === 'KeyM')       { isMuted = !isMuted; if (isMuted) ytPlayer.mute(); else ytPlayer.unMute(); muteBtn.innerHTML = isMuted ? ic.mute : ic.vol; }
    } catch {}
  });

  return ytPlayer;
}

/** Show a STREAM UNAVAILABLE error panel with retry */
function showStreamError(pid) {
  const pw = document.getElementById('pw_' + pid);
  if (!pw) return;
  pw.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                min-height:400px;background:rgba(255,107,0,.03);border:1px solid var(--c-rule);gap:16px">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-orange)" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <circle cx="12" cy="16" r=".5" fill="var(--c-orange)"/>
      </svg>
      <div style="font-family:var(--f-mono);font-size:12px;letter-spacing:.2em;color:var(--c-orange)">
        STREAM UNAVAILABLE
      </div>
      <button class="o-btn" onclick="location.reload()" style="margin-top:8px">RETRY</button>
    </div>`;
}
