import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import type { AnnouncementItem } from "@/types/database";
import AnnouncementDetail from "./AnnouncementDetail";

// Always render fresh so admin edits appear immediately.
export const revalidate = 0;

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load announcement:", error.message);
  }

  const announcement = (data as unknown as AnnouncementItem) ?? null;
  if (!announcement) notFound();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />
      {/* Page gutter + fixed-navbar clearance; the white card floats on the pink background. */}
      <div className="px-4 pt-32 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 w-full max-w-6xl rounded-3xl bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <AnnouncementDetail announcement={announcement} />
        </div>
      </div>
    </div>
  );
}
