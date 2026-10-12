import { createPublicClient } from "@/lib/supabase/public";
import type { SchoolItem } from "@/types/database";
import MembershipView from "./MembershipView";

// ISR: cache the rendered page for 1 hour. Admin mutations revalidate on demand.
export const revalidate = 3600;

export default async function MembershipPage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to load schools:", error.message);
  }

  const schools = (data as unknown as SchoolItem[]) ?? [];

  return <MembershipView schools={schools} />;
}
