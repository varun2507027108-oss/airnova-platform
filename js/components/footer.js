// js/components/footer.js
// Shared footer — rendered on every page.

import { LOGO } from '../logo.js';

export const footerHTML = () => `
<footer id="footer">
  <div class="footer-grid">

    <div>
      ${LOGO()}
      <div class="foot-brand-name">AIRNOVA</div>
      <div class="foot-brand-sub">AEROSPACE ACADEMY</div>
      <p class="foot-desc">
        When fears are grounded, dreams take flight.
        Premium aerospace education built by engineers, for engineers at VCET.
      </p>
    </div>

    <div>
      <div class="foot-col-hd">NAVIGATION</div>
      <button class="foot-link" onclick="go('home')">Home</button>
      <button class="foot-link" onclick="go('v1')">Module I</button>
      <button class="foot-link" onclick="go('v2')">Module II</button>
      <button class="foot-link" onclick="go('pdf')">Resources</button>
    </div>

    <div>
      <div class="foot-col-hd">SYSTEM</div>
      <div class="foot-sys-row"><span class="foot-sys-k">Version</span><span class="foot-sys-v">2.0 NOVA</span></div>
      <div class="foot-sys-row"><span class="foot-sys-k">Build</span><span class="foot-sys-v">2025.03</span></div>
      <div class="foot-sys-row"><span class="foot-sys-k">Status</span><span class="foot-sys-v">Operational</span></div>
      <div class="foot-sys-row"><span class="foot-sys-k">Uptime</span><span class="foot-sys-v">99.9%</span></div>
    </div>

  </div>
  <div class="foot-bottom">
    <span class="foot-copy">© 2025 TEAM AIRNOVA · ALL RIGHTS RESERVED</span>
    <span class="foot-copy">BUILT FOR EXCELLENCE · VCET</span>
  </div>
</footer>`;
