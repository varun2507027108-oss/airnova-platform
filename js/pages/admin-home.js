// js/pages/admin-home.js
// This is the "Welcome" screen for the Admin Portal
import { ic } from '../icons.js';
import { footerHTML } from '../components/footer.js';

/**
 * @returns {string} HTML for the Admin Welcome Dashboard
 */
export const adminHome = () => {
    return `
    <div class="page-in" style="animation: fadeIn 0.8s ease-out forwards;">
        <div style="background: rgba(255,107,0,.05); border-bottom: 1px solid rgba(255,107,0,.15); padding: 10px var(--pad); display: flex; align-items: center; gap: 20px;">
            <div style="display:flex;align-items:center;gap:7px">
                <div style="width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80"></div>
                <span style="font-family:var(--f-mono);font-size:9px;letter-spacing:.2em;color:#4ade80">ADMIN SESSION ACTIVE</span>
            </div>
            <div style="font-family:var(--f-mono);font-size:9px;letter-spacing:.16em;color:var(--c-faint)">COMMAND_CENTER // OVERVIEW</div>
        </div>

        <div style="padding: var(--sp-xl) var(--pad); min-height: 70vh;">
            <div class="label">SYSTEM OVERVIEW</div>
            <h1 class="h-display" style="font-size: clamp(2.5rem, 6vw, 5rem); margin-top: 1rem; line-height: 0.9;">
                WELCOME TO <span style="color:var(--c-orange)">COMMAND</span>
            </h1>
            
            <p style="max-width: 600px; color: var(--c-dim); margin-top: var(--sp-l); line-height: 1.8; font-size: 14px; font-family: var(--f-body);">
                From this portal, you can manage the AIRNOVA curriculum, update technical video modules, and monitor resource distribution. All changes made here are immediate for the end-user.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: var(--sp-xl);">
                
                <div class="doc-card" style="cursor:pointer" onclick="window._nav('m1')">
                    <div class="doc-card-accent" style="background:var(--c-orange)"></div>
                    <div class="doc-title">MANAGE MODULE 01</div>
                    <div class="doc-info">Update "Principles of Flight" video and outline data.</div>
                    <div style="margin-top:20px; font-family:var(--f-mono); font-size:10px; color:var(--c-orange)">LAUNCH EDITOR →</div>
                </div>

                <div class="doc-card" style="cursor:pointer" onclick="window._nav('m2')">
                    <div class="doc-card-accent" style="background:var(--c-orange)"></div>
                    <div class="doc-title">MANAGE MODULE 02</div>
                    <div class="doc-info">Update "Systems & Avionics" video and hardware specs.</div>
                    <div style="margin-top:20px; font-family:var(--f-mono); font-size:10px; color:var(--c-orange)">LAUNCH EDITOR →</div>
                </div>

                <div class="doc-card" style="cursor:pointer" onclick="window._nav('pdf')">
                    <div class="doc-card-accent" style="background:#60a5fa"></div>
                    <div class="doc-title">RESOURCE CENTER</div>
                    <div class="doc-info">Upload new technical reports and safety manuals.</div>
                    <div style="margin-top:20px; font-family:var(--f-mono); font-size:10px; color:#60a5fa">OPEN REPOSITORY →</div>
                </div>

            </div>
        </div>

        ${footerHTML()}
    </div>`;
};