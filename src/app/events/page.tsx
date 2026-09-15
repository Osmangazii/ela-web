import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { EventItem } from "@/types/database";
import EventsView from "./EventsView";

// Always render fresh so admin edits appear immediately.
export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to load events:", error.message);
  }

  const events = ((data as unknown as EventItem[]) ?? []).slice();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />
      <EventsView events={events} />
    </div>
  );
}
