"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage, type Lang } from "@/components/language-context";
import Footer from "@/components/Footer";
import type { EventItem } from "@/types/database";

const DEFAULT_THEME = "#165823";
const WAVE_PATH = "M0,0 L600,80 L1200,0 L1200,120 L0,120 Z";

function formatDate(value: string | null, lang: Lang): string {
  if (!value) return "";
  const trimmed = value.trim();
  const isIso = /^\d{4}-\d{2}-\d{2}/.test(trimmed);
  if (isIso) {
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

/** Image slider for an event: one image at a time with prev/next controls. */
function EventGallery({ images, alt, theme }: { images: string[]; alt: string; theme: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = images.length;

  return (
    <div className="relative aspect-16/10 max-h-[42vh] w-full max-w-xl overflow-hidden rounded-2xl bg-slate-100 shadow-lg sm:aspect-4/3 lg:max-w-125">
      {count === 0 ? (
        <div
          className="flex h-full w-full items-center justify-center text-6xl font-black text-white"
          style={{ backgroundColor: theme }}
        >
          {(alt || "?").charAt(0).toUpperCase()}
        </div>
      ) : (
        images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-500 ${i === currentIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + count) % count)}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-800/60 transition-colors hover:text-slate-900"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % count)}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 text-slate-800/60 transition-colors hover:text-slate-900"
          >
            <ChevronIcon direction="right" />
          </button>

          {/* Counter badge */}
          <div className="absolute top-4 right-4 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
            {currentIndex + 1}/{count}
          </div>

          {/* Pagination dots / pills */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? "h-2 w-6 bg-[#ff5a5f]" : "h-2 w-2 bg-white/80 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventStory({ event, index }: { event: EventItem; index: number }) {
  const { lang } = useLanguage();

  const title = lang === "el" ? event.title_el || event.title_en : event.title_en || event.title_el;
  const location =
    lang === "el" ? event.location_el || event.location_en : event.location_en || event.location_el;
  const dateRaw = lang === "el" ? event.date_el || event.date_en : event.date_en || event.date_el;
  const date = formatDate(dateRaw, lang);
  const desc1 = lang === "el" ? event.col1_el || event.col1_en : event.col1_en || event.col1_el;
  const desc2 = lang === "el" ? event.col2_el || event.col2_en : event.col2_en || event.col2_el;
  const theme = event.theme_color || DEFAULT_THEME;
  const reversed = index % 2 === 1;

  return (
    <div className="relative box-border flex w-full min-h-screen flex-col justify-between pt-24 pb-12 lg:h-screen lg:snap-start lg:overflow-hidden lg:pb-0">
      {/* Top: hero (title / date / location + gallery) */}
      <div className="flex flex-1 items-center py-4 lg:py-0">
        <section
          className={`mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-6 lg:py-4 ${
            reversed ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div className="max-w-xl space-y-3">
            <h2 className="text-4xl leading-tight font-black tracking-tight text-slate-900 sm:text-5xl">
              {title}
            </h2>
            {date && <p className="text-base font-semibold text-slate-500">{date}</p>}
            {location && (
              <p className="flex items-center gap-2 font-medium text-slate-700">
                <PinIcon />
                {location}
              </p>
            )}
          </div>

          <EventGallery images={event.images ?? []} alt={title} theme={theme} />
        </section>
      </div>

      {/* Bottom: angled wave + dark Highlights & Impact block */}
      <div className="shrink-0">
        <div className="-mb-px w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ fill: theme }}
            className="relative block h-8 w-full md:h-12"
          >
            <path d={WAVE_PATH} />
          </svg>
        </div>

        <section style={{ backgroundColor: theme }} className="w-full px-6 pt-6 pb-10 text-white">
          <div className="mx-auto mb-4 max-w-5xl">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/90 uppercase">
              {lang === "en" ? "Highlights & Impact" : "Στιγμιότυπα & Αντίκτυπος"} • {title}
            </span>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-sm leading-relaxed font-normal text-white/90 md:grid-cols-2 sm:text-base">
            <p>{desc1}</p>
            <p>{desc2}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EventsView({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <p className="text-center text-slate-500">No upcoming events at this moment.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden scroll-smooth lg:h-screen lg:overflow-y-auto lg:snap-y lg:snap-mandatory">
      {events.map((event, index) => (
        <EventStory key={event.id} event={event} index={index} />
      ))}

      {/* Footer lives inside the snap container so it only appears after the
          last event — never on the first or intermediate events. */}
      <div className="w-full lg:snap-end">
        <Footer embedded />
      </div>
    </div>
  );
}
