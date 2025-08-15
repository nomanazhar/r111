import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only throw error if we're not in build time and the variables are missing
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production' && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  console.warn('Supabase admin env missing. Please check:');
  console.warn('1. .env.local file exists in project root');
  console.warn('2. NEXT_PUBLIC_SUPABASE_URL is set');
  console.warn('3. SUPABASE_SERVICE_ROLE_KEY is set');
  console.warn('Current values:', {
    SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
    SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
  });
}

// Create a conditional client that only works when environment variables are present
export const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;


