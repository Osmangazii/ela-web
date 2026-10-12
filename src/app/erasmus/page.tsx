import { createPublicClient } from "@/lib/supabase/public";
import type { ErasmusProject } from "@/types/database";
import ErasmusView from "./ErasmusView";

// ISR: cache the rendered page for 1 hour. Admin mutations revalidate on demand.
export const revalidate = 3600;

export default async function ErasmusPage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("erasmus_projects")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to load Erasmus+ projects:", error.message);
  }

  const projects = (data as unknown as ErasmusProject[]) ?? [];

  return <ErasmusView projects={projects} />;
}
