// js/supabase-db.js
// Database access layer — ALL module DB calls go through here.
// Operates on the `modules` table in Supabase.

import { supabase } from './supabase-client.js';

/**
 * Fetch a single module row by module_id.
 * @param {string} moduleId - e.g. 'v1', 'v2'
 * @returns {Promise<{yt_video_id:string|null, drive_download_url:string|null, title:string|null}|null>}
 */
export async function getModule(moduleId) {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('yt_video_id, drive_download_url, title')
      .eq('module_id', moduleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (err) {
    console.error('[DB] getModule failed:', err);
    return null;
  }
}

/**
 * Update a module row with new YouTube video ID and Drive download URL.
 * @param {string} moduleId
 * @param {string} ytVideoId
 * @param {string} driveUrl
 * @returns {Promise<{success:boolean, error?:string}>}
 */
export async function updateModule(moduleId, ytVideoId, driveUrl) {
  try {
    const { error } = await supabase
      .from('modules')
      .update({
        yt_video_id:        ytVideoId || null,
        drive_download_url: driveUrl  || null,
        updated_at:         new Date().toISOString()
      })
      .eq('module_id', moduleId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[DB] updateModule failed:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
