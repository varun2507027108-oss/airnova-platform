// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ksazgkpfziklmzhnwyji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXpna3BmemlrbG16aG53eWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Mjk2MDgsImV4cCI6MjA5MDUwNTYwOH0.bNjorLpUmU5wlgSNh33y_RxrcLxQkWuUuJ_neldcJYA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
