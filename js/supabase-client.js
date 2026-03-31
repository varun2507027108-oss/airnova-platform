// js/supabase-client.js
// Initialises and exports the single Supabase client instance.
// SDK loaded exclusively via CDN ESM — no npm, no bundler.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
