import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ksazgkpfziklmzhnwyji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXpna3BmemlrbG16aG53eWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Mjk2MDgsImV4cCI6MjA5MDUwNTYwOH0.bNjorLpUmU5wlgSNh33y_RxrcLxQkWuUuJ_neldcJYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  console.log("Testing Storage Upload (upsert)...");
  
  // Create a Blob to simulate a File upload correctly for Supabase Storage
  const fileContent = "dummy video content";
  const blob = new Blob([fileContent], { type: 'video/mp4' });

  const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload('p1/test.mp4', blob, { upsert: true, contentType: 'video/mp4' });
  
  if (uploadError) {
      console.log("❌ Storage Upload Failed:", uploadError.message, uploadError);
  } else {
      console.log("✅ Storage Upload Succeeded:", uploadData);
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl('p1/test.mp4');
      console.log("Public URL:", publicUrl);
  }

  console.log("\nTesting Database Upsert (onConflict)...");
  const { error: dbError } = await supabase
      .from('module_content')
      .upsert({
        module_key: 'v1',
        file_url: 'http://example.com/test.mp4',
        file_name: 'test.mp4',
        file_type: 'video',
        updated_at: new Date().toISOString()
      }, { onConflict: 'module_key' });

  if (dbError) {
      console.log("❌ Database Upsert Failed:", dbError.message, dbError);
  } else {
      console.log("✅ Database Upsert Succeeded.");
  }
}

test();
