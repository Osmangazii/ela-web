import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

/**
 * Cookie-less Supabase client for PUBLIC, cacheable (ISR) server rendering.
 *
 * Unlike `server.ts`, this never touches `cookies()`, so any route that uses it
 * can be statically rendered and revalidated on an interval (`revalidate`) or on
 * demand (`revalidatePath`). Public content is read via RLS with the anon key.
 */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
