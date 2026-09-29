'use server';

import { revalidatePath } from "next/cache";
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

export type PublicRevalidateTarget = "announcements" | "events" | "schools";

/**
 * Revalidate the affected public ISR pages immediately after an admin mutation,
 * so visitors see changes right away instead of waiting for the 1-hour
 * `revalidate` window. Called from the client admin pages after a successful
 * create / update / delete.
 */
export async function revalidatePublicAction(target: PublicRevalidateTarget) {
  switch (target) {
    case "announcements":
      revalidatePath("/announcements");
      // Revalidate every dynamic /announcements/[id] page.
      revalidatePath("/announcements/[id]", "page");
      break;
    case "events":
      revalidatePath("/events");
      break;
    case "schools":
      // The public schools list lives on /who-we-are.
      revalidatePath("/who-we-are");
      break;
  }
}
