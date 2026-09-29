import Navbar from "@/components/Navbar";
import { createPublicClient } from "@/lib/supabase/public";
import type { EventItem } from "@/types/database";
import EventsView from "./EventsView";

// ISR: cache the rendered page for 1 hour. Admin mutations revalidate on demand.
export const revalidate = 3600;

export default async function EventsPage() {
  const supabase = createPublicClient();
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
