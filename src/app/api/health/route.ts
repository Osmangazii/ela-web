import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

// Never cache this endpoint — external cron tools (e.g. UptimeRobot) ping it
// every few minutes to keep the Supabase project warm and prevent free-tier pauses.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createPublicClient();
    // Minimal round-trip to touch the database.
    await supabase.from("events").select("id").limit(1);
  } catch (error) {
    // Keep-alive should stay green even if the ping momentarily fails; the
    // request itself still warms the connection.
    console.error("Health check DB ping failed:", error);
  }

  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}
