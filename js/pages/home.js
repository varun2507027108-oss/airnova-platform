// js/pages/home.js
// Returns the full HTML string for the Home page.

import { ic }        from '../icons.js';
import { footerHTML } from '../components/footer.js';

export const homePage = () => `
<div class="page-in">

  <!-- ── HERO ───────────────────────────────── -->
  <section class="hero">
    <div class="hero-dots"></div>
    <div class="hero-stripe"></div>

    <div class="hero-inner">

      <!-- Left column -->
      <div class="hero-l">
        <div class="hero-eyebrow">
          <div class="label">TEAM AIRNOVA · VCET 2025</div>
        </div>
        <h1 class="hero-h">
          WHEN<br>
          FEARS<br>
          ARE<br>
          <em>GROUNDED</em>
        </h1>
        <p class="hero-body">
          A premium aerospace learning platform — scholarly depth,
          cinematic delivery, custom video upload on every module.
          Your altitude. Your pace.
        </p>
        <div class="hero-cta">
          <button class="o-btn" onclick="go('v1')">BEGIN MODULE I ${ic.arr}</button>
          <button class="g-btn" onclick="document.getElementById('abt').scrollIntoView({behavior:'smooth'})">
            ABOUT ${ic.chev}
          </button>
        </div>
      </div>

      <!-- Right column -->
      <div class="hero-r">
        <div style="position:relative;z-index:1">
          <div class="label" style="margin-bottom:24px">DREAMS TAKE FLIGHT</div>
          <p style="font-family:var(--f-display);font-size:clamp(1rem,2.2vw,2rem);
                    font-weight:800;letter-spacing:-.02em;line-height:1;
                    color:rgba(235,235,235,0.1);word-break:break-word;overflow:hidden">
            THE SKY IS NOT<br>THE LIMIT
          </p>
        </div>
        <div class="hero-stats" style="position:relative;z-index:1">
          <div class="h-stat"><div class="h-stat-val">200+</div><div class="h-stat-lbl">Students Trained</div></div>
          <div class="h-stat"><div class="h-stat-val">15+</div><div class="h-stat-lbl">Expert Modules</div></div>
          <div class="h-stat"><div class="h-stat-val">98%</div><div class="h-stat-lbl">Satisfaction</div></div>
          <div class="h-stat"><div class="h-stat-val">5★</div><div class="h-stat-lbl">Average Rating</div></div>
        </div>
      </div>

    </div>

    <div class="hero-bg-num">01</div>
    <div class="scroll-nudge">
      <span>SCROLL</span>
      ${ic.chev}
    </div>
  </section>

  <!-- ── ABOUT SPLIT ─────────────────────────── -->
  <section id="abt" class="about-split">
    <div class="about-num">
      <span style="position:relative;z-index:1">AN</span>
    </div>
    <div class="about-content">
      <div class="label">WHO WE ARE</div>
      <h2 class="about-title">BUILT BY<br>AVIATORS.<br>FOR AVIATORS.</h2>
      <p class="about-body">
        Team Airnova is a collective of engineering students and aerospace
        enthusiasts at VCET united by one mission — to make high-quality
        aeronautical education accessible, rigorous, and deeply inspiring.
        Our curriculum is built on real-world principles: from the physics
        of lift to the ethics of safety culture.
      </p>
      <div class="about-tags">
        <span class="about-tag">Aeronautics</span>
        <span class="about-tag">Flight Dynamics</span>
        <span class="about-tag">Avionics</span>
        <span class="about-tag">Safety Eng.</span>
        <span class="about-tag">Navigation</span>
      </div>
    </div>
  </section>

  <!-- ── SYSTEM PANEL ────────────────────────── -->
  <div class="sys-panel wrap" style="max-width:100%;border-top:1px solid var(--c-rule)">
    <div class="sys-item">
      <div class="sys-val">2025</div>
      <div class="sys-lbl">Est.</div>
    </div>
    <div class="sys-item" style="padding-left:32px;border-left:1px solid var(--c-rule)">
      <div class="sys-val">30+</div>
      <div class="sys-lbl">Members</div>
    </div>
    <div class="sys-item" style="padding-left:32px;border-left:1px solid var(--c-rule)">
      <div class="sys-val">12+</div>
      <div class="sys-lbl">Projects</div>
    </div>
  </div>

  <!-- ── FEATURE MANIFESTO ──────────────────── -->
  <section class="manifesto wrap">
    <div class="manifesto-header">
      <div>
        <div class="label">WHY AIRNOVA</div>
        <h2 class="h-display" style="font-size:clamp(2.5rem,5vw,5rem);margin-top:16px">
          THE<br>AIRNOVA<br>EDGE
        </h2>
      </div>
      <p class="manifesto-sub">
        Six operational pillars that define the AIRNOVA methodology.
        Each one engineered with the same zero-compromise mentality
        that governs aerospace itself.
      </p>
    </div>

    <div class="feat-row">
      <div class="feat-idx">01</div>
      <div class="feat-name">AERONAUTICS FIRST</div>
      <div class="feat-desc">Real-world aerospace curriculum built on principles pilots and engineers actually use — no filler, no fluff.</div>
    </div>
    <div class="feat-row">
      <div class="feat-idx">02</div>
      <div class="feat-name">SAFETY CULTURE</div>
      <div class="feat-desc">Zero-compromise protocols derived from actual aviation safety standards. Precision is the only acceptable standard.</div>
    </div>
    <div class="feat-row">
      <div class="feat-idx">03</div>
      <div class="feat-name">SCHOLARLY DEPTH</div>
      <div class="feat-desc">Academic rigour meets accessible delivery. Designed to permanently change how you understand the sky.</div>
    </div>
    <div class="feat-row">
      <div class="feat-idx">04</div>
      <div class="feat-name">AVIATOR COMMUNITY</div>
      <div class="feat-desc">A growing collective of engineers, students, and dreamers actively shaping the future of aerospace education.</div>
    </div>
    <div class="feat-row">
      <div class="feat-idx">05</div>
      <div class="feat-name">UPLOAD YOUR VIDEOS</div>
      <div class="feat-desc">Custom video upload on every single module. Bring your own lectures, your own materials, your own altitude.</div>
    </div>
    <div class="feat-row">
      <div class="feat-idx">06</div>
      <div class="feat-name">RAPID UPSKILLING</div>
      <div class="feat-desc">Dense, focused sessions compressing months of textbook content into hours of applied, retained insight.</div>
    </div>

    <div style="border-top:1px solid var(--c-rule)"></div>
  </section>

  <!-- ── CTA BAND ────────────────────────────── -->
  <div class="cta-band">
    <div class="cta-txt">READY TO<br>TAKE OFF?</div>
    <button class="cta-dark-btn" onclick="go('v1')">LAUNCH MODULE I →</button>
  </div>

  ${footerHTML()}
</div>`;
