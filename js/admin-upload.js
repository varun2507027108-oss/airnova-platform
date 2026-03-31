// js/admin-upload.js
// Admin input panel logic — replaces the old drag-and-drop upload system.
// Manages YouTube Video ID and Google Drive URL inputs for each module.

import { getModule, updateModule } from './supabase-db.js';

/**
 * Fetch existing module data and populate the admin input fields.
 * @param {string} pid - Player ID prefix, e.g. 'p1'
 * @returns {Promise<object|null>} The module data, or null
 */
export async function initAdminInputs(pid) {
  const moduleId = pid === 'p1' ? 'v1' : 'v2';
  try {
    const data = await getModule(moduleId);
    if (data) {
      const ytInput    = document.getElementById('yt_input_'    + pid);
      const driveInput = document.getElementById('drive_input_' + pid);
      if (ytInput)    ytInput.value    = data.yt_video_id        || '';
      if (driveInput) driveInput.value = data.drive_download_url || '';
    }
    return data;
  } catch (err) {
    console.error('[Admin] initAdminInputs failed:', err);
    return null;
  }
}

/**
 * Save both input values to Supabase and update the status row.
 * Exposed on window so inline onclick can call it.
 * @param {string} pid - Player ID prefix
 */
window.saveModuleData = async (pid) => {
  const moduleId  = pid === 'p1' ? 'v1' : 'v2';
  const statusEl  = document.getElementById('save_status_' + pid);
  const ytInput   = document.getElementById('yt_input_'    + pid);
  const driveInput = document.getElementById('drive_input_' + pid);

  if (!statusEl) return;

  /* Saving state */
  statusEl.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;color:var(--c-orange)">
      <div style="width:14px;height:14px;border:2px solid var(--c-orange);
                  border-top-color:transparent;border-radius:50%;
                  animation:spin .8s linear infinite"></div>
      <span>SAVING…</span>
    </div>`;

  try {
    const result = await updateModule(
      moduleId,
      (ytInput   ? ytInput.value.trim()   : ''),
      (driveInput ? driveInput.value.trim() : '')
    );

    if (result.success) {
      statusEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;color:#4ade80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="#4ade80" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          <span>SAVED SUCCESSFULLY</span>
        </div>`;
    } else {
      statusEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;color:#f87171">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>ERROR — ${result.error || 'Unknown error'}</span>
        </div>`;
    }
  } catch (err) {
    statusEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;color:#f87171">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>ERROR — ${err.message || 'Save failed'}</span>
      </div>`;
  }
};
