const { createClient } = require('@supabase/supabase-js');

// Environment variables should already be loaded by server.js
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking Supabase config...');
console.log('SUPABASE_URL exists:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('SUPABASE_URL:', supabaseUrl || 'undefined');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '***present***' : 'undefined');
  console.error('Please check your .env file in the backend folder');
  // Don't throw error, let the app handle it gracefully
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.warn('⚠️ Supabase connection warning:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (error) {
    console.warn('⚠️ Supabase connection warning:', error.message);
  }
};

// Test connection in background
testConnection();

module.exports = supabase;