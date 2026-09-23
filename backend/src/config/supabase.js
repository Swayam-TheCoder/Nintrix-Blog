import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing");
}

/*
 * Used for normal authentication.
 *
 * Signup
 * Login
 * Refresh
 * Password reset
 */
export const supabaseAuth = createClient(
  supabaseUrl,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

/*
 * Server-only client.
 *
 * Database operations
 * Admin operations
 * Anything requiring elevated privileges
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);