import { adminHome } from './pages/admin-home.js';
import { adminPage } from './pages/admin-page.js';

const MASTER_KEY = "airnova2025";

/* ── Helper: reveal admin shell, hide gate ── */
function showAdminShell() {
    const gate = document.getElementById('gate');
    const nav  = document.getElementById('nav');
    const root = document.getElementById('admin-root');
    if (gate) gate.classList.add('hidden');
    if (nav)  nav.style.display = '';
    if (root) root.style.display = '';
}

// 1. The Gatekeeper
window._gateSubmit = () => {
    const input = document.getElementById('gate-input');
    const pass  = input.value;
    const err   = document.getElementById('gate-err');

    if (pass === MASTER_KEY) {
        sessionStorage.setItem('airnova_admin', 'true');
        showAdminShell();
        window._nav('home');
    } else {
        // Visual feedback on wrong passkey
        if (err) err.textContent = '⛔ ACCESS DENIED — INVALID PASSKEY';
        input.classList.add('error', 'shake');
        setTimeout(() => input.classList.remove('shake'), 400);
    }
};

// 2. The Router
window._nav = (panel) => {
    const root = document.getElementById('admin-root');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.toggle('on', btn.dataset.ap === panel);
    });

    if (panel === 'home') {
        root.innerHTML = adminHome();
    } else {
        root.innerHTML = adminPage(panel);
    }
    window.scrollTo(0, 0);
};

// 3. Admin navigation (used by nav buttons in admin.html)
window._adminGo = (panel) => {
    window._nav(panel);
};

// 4. Logout
window._adminLogout = () => {
    sessionStorage.removeItem('airnova_admin');
    location.reload();
};

// 5. Persistent Session — auto-unlock if already authenticated
if (sessionStorage.getItem('airnova_admin') === 'true') {
    showAdminShell();
    window._nav('home');
}