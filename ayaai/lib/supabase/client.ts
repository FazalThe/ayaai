import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Define Supabase URL and anon key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Create and return the Supabase client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
