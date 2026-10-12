import type { AnnouncementCategory, AnnouncementBlock, AnnouncementItem } from "@/types/database";
import type { Lang } from "@/components/language-context";

/** Human labels for each announcement category, per language. */
export const CATEGORY_LABELS: Record<Lang, Record<AnnouncementCategory, string>> = {
  en: {
    "Membership Updates": "Membership Updates",
    "Calls for Participation": "Calls for Participation",
    "Institutional News": "Institutional News",
    "Deadlines & Important Dates": "Deadlines & Important Dates",
  },
  el: {
    "Membership Updates": "Ενημερώσεις Μελών",
    "Calls for Participation": "Προσκλήσεις Συμμετοχής",
    "Institutional News": "Θεσμικά Νέα",
    "Deadlines & Important Dates": "Προθεσμίες & Σημαντικές Ημερομηνίες",
  },
};

/** Localised category label with a graceful fallback for unknown values. */
export function categoryLabel(category: string | null, lang: Lang): string {
  const key = category as AnnouncementCategory;
  if (key && CATEGORY_LABELS[lang][key]) return CATEGORY_LABELS[lang][key];
  return category || (lang === "el" ? "Ανακοίνωση" : "Notice");
}

/** Localised announcement title with EN/EL fallback. */
export function announcementTitle(item: AnnouncementItem, lang: Lang): string {
  return lang === "el" ? item.title_el || item.title_en : item.title_en || item.title_el;
}

/** Format an ISO (YYYY-MM-DD) date according to the active language. */
export function formatAnnouncementDate(value: string | null, lang: Lang): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat(lang === "el" ? "el-GR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(d);
    }
  }
  return trimmed;
}

/**
 * Build a short plain-text excerpt from the first `text` block of an
 * announcement (falls back to the English/Greek content appropriately).
 */
export function announcementExcerpt(item: AnnouncementItem, lang: Lang, max = 150): string {
  const blocks = item.blocks ?? [];
  const textBlock = blocks.find(
    (b): b is Extract<AnnouncementBlock, { type: "text" }> => b.type === "text",
  );
  if (!textBlock) return "";

  const raw =
    lang === "el"
      ? textBlock.content_el || textBlock.content_en
      : textBlock.content_en || textBlock.content_el;

  const clean = raw.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

/**
 * Localised "Deadline: <date>" label. Empty string when there is no deadline,
 * so callers can render it as an optional badge.
 */
export function deadlineText(value: string | null, lang: Lang): string {
  const formatted = formatAnnouncementDate(value, lang);
  if (!formatted) return "";
  return `${lang === "el" ? "Προθεσμία" : "Deadline"}: ${formatted}`;
}
