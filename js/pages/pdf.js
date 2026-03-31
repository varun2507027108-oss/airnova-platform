// js/pages/pdf.js  [PUBLIC — READ-ONLY]
// Returns the HTML string for the PDF Resource Centre page.
// Document management controls live exclusively in js/pages/admin-page.js.

import { ic }         from '../icons.js';
import { footerHTML } from '../components/footer.js';

const PDF_SRC = '';

const DOCUMENTS = [
  {
    title: 'AIRNOVA Technical Report 2025',
    pages: 20,
    size:  '2.4 MB',
    tag:   'FLAGSHIP',
    color: '#FF6B00',
  },
  {
    title: 'Flight Safety Standards Manual',
    pages: 48,
    size:  '5.1 MB',
    tag:   'SAFETY',
    color: '#4ade80',
  },
  {
    title: 'Aerodynamics Reference Guide',
    pages: 32,
    size:  '3.7 MB',
    tag:   'REFERENCE',
    color: '#60a5fa',
  },
];

export const pdfPage = () => {

  return `
<div class="page-in">
  <div class="pdf-page">

    <!-- ── Page header ──────────────────────── -->
    <div class="pdf-topbar">
      <div>
        <div class="label">KNOWLEDGE BASE</div>
        <h1 class="h-display"
            style="font-size:clamp(2rem,4vw,3.5rem);margin-top:12px">
          PDF RESOURCE CENTER
        </h1>
        <p style="font-size:13px;color:var(--c-dim);line-height:1.75;
                  margin-top:10px;max-width:500px">
          Official reports, technical manuals, and reference documents
          curated by Team Airnova for serious aerospace learners.
        </p>
      </div>
    </div>

    <div style="padding:var(--sp-l) var(--pad)">

      <!-- ── Embedded viewer ──────────────── -->
      <div class="pdf-shell">
        <div class="pdf-toolbar">
          <div class="pdf-meta-row">
            <div class="pdf-icon">${ic.pdf}</div>
            <div>
              <div class="pdf-fname">AIRNOVA_Technical_Report_2025.pdf</div>
              <div class="pdf-fmeta">20 PAGES · 2.4 MB · FLAGSHIP DOCUMENT</div>
            </div>
          </div>
          <a href="${PDF_SRC}" download="airnova-report.pdf" target="_blank"
             class="o-btn" style="text-decoration:none">
            ${ic.dl} DOWNLOAD REPORT
          </a>
        </div>
        <iframe src="${PDF_SRC}#toolbar=0&navpanes=0"
                title="PDF Viewer"
                style="width:100%;height:620px;border:none;
                       display:block;background:#111">
        </iframe>
      </div>

    </div>
  </div>

  ${footerHTML()}
</div>`;
};
