"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage, type Lang } from "@/components/language-context";
import type { AnnouncementCategory, AnnouncementItem } from "@/types/database";
import {
  announcementExcerpt,
  announcementTitle,
  categoryLabel,
  formatAnnouncementDate,
} from "@/lib/announcements";

type CategoryKey = "all" | AnnouncementCategory;

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
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

      <main className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
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

        {/* Archive list — minimalist rows, no media/tables/PDFs */}
        <div className="mt-10 border-t border-slate-200/80">
          {filtered.map((item) => {
            const title = announcementTitle(item, lang);
            const date = formatAnnouncementDate(item.date, lang);
            const excerpt = announcementExcerpt(item, lang);

            return (
              <Link
                key={item.id}
                href={`/announcements/${item.id}`}
                className="group flex cursor-pointer flex-col gap-3 border-b border-slate-200/80 px-3 py-6 transition-colors hover:bg-white/70 md:flex-row md:items-center md:gap-8"
              >
                {/* Left: date & category */}
                <div className="md:w-44 md:shrink-0">
                  {date && (
                    <p className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-brand-green">
                      {date}
                    </p>
                  )}
                  <span className="mt-1 inline-block rounded-full bg-brand-pink-light/50 px-2.5 py-0.5 text-xs font-bold text-brand-green">
                    {categoryLabel(item.category, lang)}
                  </span>
                </div>

                {/* Middle: title + excerpt */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-brand-pink sm:text-xl">
                    {title}
                  </h2>
                  {excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{excerpt}</p>
                  )}
                </div>

                {/* Right: arrow affordance */}
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all group-hover:border-brand-pink group-hover:bg-brand-pink group-hover:text-white md:flex">
                  <ArrowIcon />
                </span>
              </Link>
            );
          })}
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
