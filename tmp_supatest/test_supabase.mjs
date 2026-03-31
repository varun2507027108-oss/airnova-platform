import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ksazgkpfziklmzhnwyji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYXpna3BmemlrbG16aG53eWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Mjk2MDgsImV4cCI6MjA5MDUwNTYwOH0.bNjorLpUmU5wlgSNh33y_RxrcLxQkWuUuJ_neldcJYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  // TEST 1: Storage upload
  console.log("=== TEST 1: Storage Upload ===");
  const blob = new Blob(["test content"], { type: 'video/mp4' });
  const { data: upData, error: upError } = await supabase.storage
    .from('videos')
    .upload('p1/test.mp4', blob, { upsert: true, contentType: 'video/mp4' });

  if (upError) {
    console.log("❌ STORAGE FAILED:", JSON.stringify(upError, null, 2));
  } else {
    console.log("✅ STORAGE OK:", JSON.stringify(upData, null, 2));
  }

  // TEST 2: Get public URL
  console.log("\n=== TEST 2: Public URL ===");
  const { data: urlData } = supabase.storage.from('videos').getPublicUrl('p1/test.mp4');
  console.log("Public URL:", urlData.publicUrl);

  // TEST 3: Database UPDATE (not upsert)
  console.log("\n=== TEST 3: Database UPDATE ===");
  const { data: dbData, error: dbError, count } = await supabase
    .from('module_content')
    .update({
      file_url: urlData.publicUrl,
      file_name: 'test.mp4',
      file_type: 'video',
      updated_at: new Date().toISOString()
    })
    .eq('module_key', 'v1')
    .select();

  if (dbError) {
    console.log("❌ DB UPDATE FAILED:", JSON.stringify(dbError, null, 2));
  } else {
    console.log("✅ DB UPDATE OK:", JSON.stringify(dbData, null, 2));
  }

  // TEST 4: Read back the row
  console.log("\n=== TEST 4: Read back row ===");
  const { data: readData, error: readError } = await supabase
    .from('module_content')
    .select('*')
    .eq('module_key', 'v1')
    .single();

  if (readError) {
    console.log("❌ READ FAILED:", JSON.stringify(readError, null, 2));
  } else {
    console.log("✅ ROW DATA:", JSON.stringify(readData, null, 2));
  }

  // TEST 5: List storage buckets
  console.log("\n=== TEST 5: List buckets ===");
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.log("❌ LIST BUCKETS FAILED:", JSON.stringify(bucketsError, null, 2));
  } else {
    console.log("✅ BUCKETS:", buckets.map(b => `${b.name} (public: ${b.public})`).join(', '));
  }
}

test();
