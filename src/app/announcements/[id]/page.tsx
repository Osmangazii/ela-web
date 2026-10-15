import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createPublicClient } from "@/lib/supabase/public";
import type { AnnouncementItem } from "@/types/database";
import AnnouncementDetail from "./AnnouncementDetail";

// ISR: cache each rendered detail page for 1 hour. Admin mutations revalidate on demand.
export const revalidate = 3600;

// Allow IDs created after the last build to be rendered on demand (and cached).
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("announcements").select("id");
    return ((data as unknown as { id: string }[]) ?? []).map((row) => ({ id: row.id }));
  } catch {
    return [];
  }
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createPublicClient();
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
    <div className="min-h-screen bg-brand-beige text-brand-dark antialiased">
      <Navbar />
      {/* Page gutter + fixed-navbar clearance; the white card floats on the beige background. */}
      <div className="px-4 pt-32 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 w-full max-w-6xl rounded-3xl bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <AnnouncementDetail announcement={announcement} />
        </div>
      </div>
    </div>
  );
}
