"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage, type Lang } from "@/components/language-context";
import type {
  AnnouncementBlock,
  AnnouncementCategory,
  AnnouncementItem,
} from "@/types/database";

type CategoryKey = "all" | AnnouncementCategory;

const CATEGORY_LABELS: Record<Lang, Record<AnnouncementCategory, string>> = {
  en: {
    "Official Notice": "Official Notice",
    "General Assembly": "General Assembly",
    Article: "Article",
    News: "News",
  },
  el: {
    "Official Notice": "Επίσημη Ανακοίνωση",
    "General Assembly": "Γενική Συνέλευση",
    Article: "Άρθρο",
    News: "Νέα",
  },
};

const FILTER_TABS: Record<Lang, { key: CategoryKey; label: string }[]> = {
  en: [
    { key: "all", label: "All" },
    { key: "Official Notice", label: "Official Notices" },
    { key: "General Assembly", label: "General Assembly" },
    { key: "Article", label: "Articles" },
    { key: "News", label: "News" },
  ],
  el: [
    { key: "all", label: "Όλα" },
    { key: "Official Notice", label: "Επίσημες Ανακοινώσεις" },
    { key: "General Assembly", label: "Γενικές Συνελεύσεις" },
    { key: "Article", label: "Άρθρα" },
    { key: "News", label: "Νέα" },
  ],
};

const IMAGE_WIDTH: Record<"full" | "md" | "sm", string> = {
  full: "w-full",
  md: "w-full md:w-3/5",
  sm: "w-full md:w-[30%]",
};

function formatDate(value: string | null, lang: Lang): string {
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

function categoryLabel(category: string | null, lang: Lang): string {
  const key = category as AnnouncementCategory;
  if (key && CATEGORY_LABELS[lang][key]) return CATEGORY_LABELS[lang][key];
  return category || (lang === "el" ? "Ανακοίνωση" : "Notice");
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

function BlockRenderer({ block, lang }: { block: AnnouncementBlock; lang: Lang }) {
  switch (block.type) {
    case "text": {
      const content = lang === "el" ? block.content_el || block.content_en : block.content_en || block.content_el;
      if (!content) return null;
      return (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
          {content}
        </p>
      );
    }

    case "image": {
      if (!block.url) return null;
      return (
        <div className={`${IMAGE_WIDTH[block.width]} my-2 overflow-hidden rounded-2xl`}>
          <Image
            src={block.url}
            alt="Announcement image"
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-auto w-full object-contain"
          />
        </div>
      );
    }

    case "table": {
      const headers = block.headers ?? [];
      const rows = block.rows ?? [];
      if (headers.length === 0 && rows.length === 0) return null;
      return (
        <div className="my-2 overflow-x-auto rounded-2xl border border-slate-200/70">
          <table className="w-full min-w-105 border-collapse text-left text-sm">
            {headers.length > 0 && (
              <thead>
                <tr className="bg-slate-50">
                  {headers.map((h, i) => (
                    <th key={i} className="border-b border-slate-200 px-4 py-2.5 font-semibold text-slate-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="even:bg-slate-50/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b border-slate-100 px-4 py-2.5 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "pdf": {
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-2 inline-flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-pink hover:text-brand-pink"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
            <FileIcon />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-bold">{block.title || (lang === "el" ? "Λήψη PDF" : "Download PDF")}</span>
            <span className="text-xs font-normal text-slate-400">PDF</span>
          </span>
        </a>
      );
    }

    default:
      return null;
  }
}

function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  const { lang } = useLanguage();

  const title = lang === "el" ? item.title_el || item.title_en : item.title_en || item.title_el;
  const date = formatDate(item.date, lang);
  const blocks = item.blocks ?? [];

  return (
    <article className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="inline-block rounded-full bg-brand-pink-light/50 px-3 py-1 text-xs font-bold text-brand-green">
            {categoryLabel(item.category, lang)}
          </span>
          <h2 className="mt-3 text-xl leading-snug font-black tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
        </div>
        {date && <p className="shrink-0 text-sm font-semibold text-slate-500">{date}</p>}
      </header>

      {blocks.length > 0 && (
        <div className="mt-6 space-y-4">
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} lang={lang} />
          ))}
        </div>
      )}
    </article>
  );
}

export default function AnnouncementsView({ announcements }: { announcements: AnnouncementItem[] }) {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  const filtered = useMemo(
    () =>
      announcements.filter((a) => {
        if (selectedCategory === "all") return true;
        return (a.category ?? "") === selectedCategory;
      }),
    [announcements, selectedCategory],
  );

  return (
    <>
      {/* HERO */}
      <header className="mx-auto max-w-6xl px-6 pt-32 pb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-green">
          {lang === "en" ? "Announcements & Insights" : "Ανακοινώσεις & Άρθρα"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          {lang === "en"
            ? "The latest board decisions, event programs, and articles from the world of education."
            : "Τελευταίες αποφάσεις του διοικητικού συμβουλίου, προγράμματα εκδηλώσεων και άρθρα από τον κόσμο της εκπαίδευσης."}
        </p>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {FILTER_TABS[lang].map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-brand-pink font-bold text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Announcement cards */}
        <div className="mx-auto mt-10 max-w-4xl space-y-6">
          {filtered.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-slate-500">
            {lang === "en" ? "No announcements yet." : "Δεν υπάρχουν ακόμα ανακοινώσεις."}
          </p>
        )}
      </main>
    </>
  );
}
