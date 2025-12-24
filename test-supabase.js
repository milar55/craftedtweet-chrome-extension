const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ndahffqjnrndcavudslm.supabase.co';
const supabaseAnonKey = 'sb_publishable_23OHkR0e0asxNo3n_dmeGg_aHDADXkG';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  // Since we don't have tables yet, we'll try to get the session
  // which tests the auth endpoint connection.
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Connection to Supabase Auth successful!');
    
    // Also try a simple query to the API (PostgREST)
    // This will likely return an error because the table doesn't exist,
    // but a "relation does not exist" error confirms the API is reachable.
    const { error: apiError } = await supabase.from('test_connection').select('*').limit(1);
    
    if (apiError && apiError.code === 'PGRST116') {
        // This code means the record wasn't found (if table existed) or similar
        console.log('✅ API is reachable.');
    } else if (apiError && apiError.message.includes('relation "test_connection" does not exist')) {
        console.log('✅ API is reachable (confirmed: table does not exist yet).');
    } else if (apiError) {
        console.warn('⚠️ API returned an unexpected error, but connection might be okay:', apiError.message);
    } else {
        console.log('✅ API query successful!');
    }
  }
}

testConnection();

