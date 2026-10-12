import type { ErasmusStatus } from "@/types/database";
import type { Lang } from "@/components/language-context";

/** Official Erasmus+ project status values. */
export const ERASMUS_STATUSES: ErasmusStatus[] = ["Active", "Completed", "Call for Partners"];

/** Localised status labels (EN/EL). */
export const ERASMUS_STATUS_LABELS: Record<Lang, Record<ErasmusStatus, string>> = {
  en: {
    Active: "Active",
    Completed: "Completed",
    "Call for Partners": "Call for Partners",
  },
  el: {
    Active: "Ενεργό",
    Completed: "Ολοκληρωμένο",
    "Call for Partners": "Αναζήτηση Εταίρων",
  },
};

/** Localised status label with a graceful fallback for unknown values. */
export function erasmusStatusLabel(status: string | null, lang: Lang): string {
  const key = status as ErasmusStatus;
  if (key && ERASMUS_STATUS_LABELS[lang][key]) return ERASMUS_STATUS_LABELS[lang][key];
  return status || "";
}

/** Split a comma-separated field ("Inclusion, Digital Literacy") into a list. */
export function splitList(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatMonthYear(value: string | null, lang: Lang): string {
  if (!value) return "";
  const trimmed = value.trim();
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return trimmed;
  return new Intl.DateTimeFormat(lang === "el" ? "el-GR" : "en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(d);
}

/** "Sep 2024 – Aug 2026" style range, tolerant of a missing start or end. */
export function formatErasmusDateRange(
  start: string | null,
  end: string | null,
  lang: Lang,
): string {
  const s = formatMonthYear(start, lang);
  const e = formatMonthYear(end, lang);
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
}
