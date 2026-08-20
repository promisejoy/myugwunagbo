const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase.from('service_prices').select('count');
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      console.log('ℹ️  Please create the service_prices table in Supabase');
    } else {
      console.log('✅ Supabase connected successfully');
      console.log('📊 service_prices table exists with', data?.[0]?.count || 0, 'records');
    }
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  }
})();

module.exports = supabase;