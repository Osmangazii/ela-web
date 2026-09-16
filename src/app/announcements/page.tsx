import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { AnnouncementItem } from "@/types/database";
import AnnouncementsView from "./AnnouncementsView";

// Always render fresh so admin edits appear immediately.
export const revalidate = 0;

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load announcements:", error.message);
  }

  const announcements = (data as unknown as AnnouncementItem[]) ?? [];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />
      <AnnouncementsView announcements={announcements} />
    </div>
  );
}
