import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

/**
 * Browser/client-side Supabase client.
 * Use this inside Client Components and event handlers.
 *
 * NOTE: it is intentionally not bound to the `Database` generated type — row
 * shapes are asserted at the call site with the `*Item` types from
 * `@/types/database`, which keeps CRUD builders (insert/update/delete) simple.
 * The server client in `server.ts` remains typed with `Database`.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
