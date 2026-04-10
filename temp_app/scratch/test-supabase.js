const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

async function testConnection() {
  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  console.log('Testing connection to:', supabaseUrl);
  console.log('Using Key (first 10 chars):', supabaseKey ? supabaseKey.substring(0, 10) : 'MISSING');

  if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing URL or Key in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Try to fetch something from profiles
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

  if (error) {
    console.error('Connection Failed! ❌');
    console.error('Error Message:', error.message);
    console.error('Status Code:', error.status);
    
    if (error.message.includes('Invalid API key')) {
        console.error('IDENTIFIED: Your ANON_KEY is wrong.');
    } else if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
        console.error('IDENTIFIED: Your SUBAPASE_URL is wrong or unreachable.');
    }
  } else {
    console.log('Connection Successful! ✅');
    console.log('Successfully queried profiles table.');
  }
}

testConnection();
