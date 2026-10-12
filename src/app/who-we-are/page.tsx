import { createPublicClient } from "@/lib/supabase/public";
import type { BoardMember } from "@/types/database";
import WhoWeAreView from "./WhoWeAreView";

// ISR: cache the rendered page for 1 hour.
export const revalidate = 3600;

export default async function WhoWeArePage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("board_members")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to load board members:", error.message);
  }

  const boardMembers = (data as unknown as BoardMember[]) ?? [];

  return <WhoWeAreView boardMembers={boardMembers} />;
}
