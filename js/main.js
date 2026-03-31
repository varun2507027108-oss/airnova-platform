// js/main.js
// Public application entry point — READ-ONLY build.
// Upload logic is intentionally absent. See admin.html for the admin portal.

import { homePage }   from './pages/home.js';
import { videoPage, initVideoPage }  from './pages/video.js';
import { pdfPage, loadCloudPdf }    from './pages/pdf.js';

/* ── Expose to inline onclick handlers ───────── */
window.go        = go;
window.toggleMob = toggleMob;

/* ── State ───────────────────────────────────── */
let currentPage = 'home';
let mobOpen     = false;

/* ── Navbar scroll behaviour ─────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('nav')
    .classList.toggle('solid', window.scrollY > 40);
});

/* ── Mobile menu ─────────────────────────────── */
function toggleMob() {
  mobOpen = !mobOpen;
  document.getElementById('mobDrawer')
    .classList.toggle('show', mobOpen);
}

/* ── Navigation ──────────────────────────────── */
function go(page) {
  currentPage = page;
  mobOpen     = false;

  document.getElementById('mobDrawer').classList.remove('show');

  document.querySelectorAll('[data-p]').forEach(btn => {
    btn.classList.toggle('on', btn.dataset.p === page);
  });

  window.scrollTo(0, 0);
  render();
}

/* ── Render ──────────────────────────────────── */
function render() {
  const root = document.getElementById('root');

  switch (currentPage) {
    case 'home': root.innerHTML = homePage();   break;
    case 'v1':   root.innerHTML = videoPage(1); break;
    case 'v2':   root.innerHTML = videoPage(2); break;
    case 'pdf':  root.innerHTML = pdfPage();    break;
    default:     root.innerHTML = homePage();
  }

  if (currentPage === 'v1') { setTimeout(() => initVideoPage(1), 60); }
  if (currentPage === 'v2') { setTimeout(() => initVideoPage(2), 60); }
  if (currentPage === 'pdf') { setTimeout(() => loadCloudPdf(), 100); }
}

/* ── Boot ────────────────────────────────────── */
render();
