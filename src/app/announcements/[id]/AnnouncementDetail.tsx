"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage, type Lang } from "@/components/language-context";
import type { AnnouncementBlock, AnnouncementItem } from "@/types/database";
import { announcementTitle, categoryLabel, formatAnnouncementDate } from "@/lib/announcements";

type PdfBlockData = Extract<AnnouncementBlock, { type: "pdf" }>;

const IMAGE_WIDTH: Record<"full" | "md" | "sm", string> = {
  full: "w-full",
  md: "w-full md:w-3/5",
  sm: "w-full md:w-[30%]",
};

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** PDF download card that best-effort resolves the file size via a HEAD request. */
function PdfBlock({ block, lang }: { block: PdfBlockData; lang: Lang }) {
  const [size, setSize] = useState("");

  useEffect(() => {
    if (!block.url) return;
    let cancelled = false;
    fetch(block.url, { method: "HEAD" })
      .then((res) => {
        const len = Number(res.headers.get("content-length"));
        if (!cancelled && len) setSize(formatBytes(len));
      })
      .catch(() => {
        /* size is optional — ignore failures (CORS / missing header) */
      });
    return () => {
      cancelled = true;
    };
  }, [block.url]);

  if (!block.url) return null;

  return (
    <a
      href={block.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-brand-pink"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
        <FileIcon />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-bold text-slate-800">
          {block.title || (lang === "el" ? "Λήψη PDF" : "Download PDF")}
        </span>
        <span className="text-xs font-normal text-slate-400">
          PDF{size ? ` · ${size}` : ""}
        </span>
      </span>
      <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-pink group-hover:text-white">
        <DownloadIcon />
      </span>
    </a>
  );
}

function BlockRenderer({ block, lang }: { block: AnnouncementBlock; lang: Lang }) {
  switch (block.type) {
    case "text": {
      const content = lang === "el" ? block.content_el || block.content_en : block.content_en || block.content_el;
      if (!content) return null;
      return (
        <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">{content}</p>
      );
    }

    case "image": {
      if (!block.url) return null;
      return (
        <div className={`${IMAGE_WIDTH[block.width]} mx-auto isolate overflow-hidden rounded-2xl shadow-sm`}>
          <Image
            src={block.url}
            alt="Announcement image"
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="block h-auto w-full rounded-2xl object-cover"
          />
        </div>
      );
    }

    case "table": {
      const headers = block.headers ?? [];
      const rows = block.rows ?? [];
      if (headers.length === 0 && rows.length === 0) return null;
      return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/70">
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

    case "pdf":
      return <PdfBlock block={block} lang={lang} />;

    default:
      return null;
  }
}

export default function AnnouncementDetail({ announcement }: { announcement: AnnouncementItem }) {
  const { lang } = useLanguage();

  const title = announcementTitle(announcement, lang);
  const date = formatAnnouncementDate(announcement.date, lang);
  const blocks = announcement.blocks ?? [];

  return (
    <article className="w-full">
      {/* Back link */}
      <Link
        href="/announcements"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-pink"
      >
        <BackIcon />
        {lang === "el" ? "Πίσω στις Ανακοινώσεις" : "Back to Announcements"}
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-slate-200/70 pb-6">
        <span className="inline-block rounded-full bg-brand-pink-light/50 px-3 py-1 text-xs font-bold text-brand-green">
          {categoryLabel(announcement.category, lang)}
        </span>
        <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {date && <p className="mt-3 text-sm font-semibold text-slate-500">{date}</p>}
      </header>

      {/* Body: vertical block stack */}
      <div className="mt-8 space-y-6">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} lang={lang} />
        ))}
        {blocks.length === 0 && (
          <p className="text-slate-500">
            {lang === "el" ? "Το περιεχόμενο θα είναι σύντομα διαθέσιμο." : "Content coming soon."}
          </p>
        )}
      </div>
    </article>
  );
}
