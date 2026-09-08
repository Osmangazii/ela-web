'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sign out in a Server Action so the auth cookies are cleared server-side,
 * then redirect back to the login page.
 */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
