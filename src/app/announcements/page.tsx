import Navbar from "@/components/Navbar";
import { createPublicClient } from "@/lib/supabase/public";
import type { AnnouncementItem } from "@/types/database";
import AnnouncementsView from "./AnnouncementsView";

// ISR: cache the rendered page for 1 hour. Admin mutations revalidate on demand.
export const revalidate = 3600;

export default async function AnnouncementsPage() {
  const supabase = createPublicClient();
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
