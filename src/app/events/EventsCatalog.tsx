"use client";

import { useMemo, useState } from "react";
import { useLanguage, type Lang } from "@/components/language-context";
import type { EventItem } from "@/types/database";

const CATEGORIES = [
  "Student events",
  "Professional learning",
  "Family and community learning",
  "International exchange",
] as const;

type Category = (typeof CATEGORIES)[number];

interface Copy {
  title: string;
  intro: string;
  approachTitle: string;
  principles: string[];
  eventsTitle: string;
  tabUpcoming: string;
  tabArchive: string;
  filterAll: string;
  categoryLabels: Record<Category, string>;
  categoryHints: Record<Category, string>;
  audienceLabel: string;
  languageLabel: string;
  registerLabel: string;
  emptyUpcoming: string;
  emptyArchive: string;
  emptyFiltered: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    title: "Where educational vision becomes practice",
    intro:
      "ELA develops shared programmes for learners, educators, families and school communities. These programmes connect foreign language education with communication, literature, science, technology, the arts, wellbeing, citizenship and intercultural learning.",
    approachTitle: "Our Educational Approach",
    principles: [
      "Language as purposeful action",
      "Interaction and mediation",
      "Inquiry and project-based learning",
      "Feedback and metacognition",
      "Multimodal and digital literacy",
      "Creativity across disciplines",
      "Inclusive participation",
    ],
    eventsTitle: "Events",
    tabUpcoming: "Upcoming",
    tabArchive: "Past / Archive",
    filterAll: "All",
    categoryLabels: {
      "Student events": "Student events",
      "Professional learning": "Professional learning",
      "Family and community learning": "Family and community learning",
      "International exchange": "International exchange",
    },
    categoryHints: {
      "Student events": "TED-Ed talks, debates, podcasts, reading programmes",
      "Professional learning": "Conferences, workshops, academies, peer exchange",
      "Family and community learning": "Webinars, discussions, social projects",
      "International exchange": "Erasmus+ activities, partnership meetings",
    },
    audienceLabel: "For",
    languageLabel: "Language",
    registerLabel: "Register / Learn more",
    emptyUpcoming: "No upcoming events at the moment. Please check back soon.",
    emptyArchive: "No archived events yet.",
    emptyFiltered: "No events in this category right now.",
  },
  el: {
    title: "Όπου το εκπαιδευτικό όραμα γίνεται πράξη",
    intro:
      "Η ELA αναπτύσσει κοινά προγράμματα για μαθητές, εκπαιδευτικούς, οικογένειες και σχολικές κοινότητες. Τα προγράμματα αυτά συνδέουν την εκπαίδευση ξένων γλωσσών με την επικοινωνία, τη λογοτεχνία, την επιστήμη, την τεχνολογία, τις τέχνες, την ευεξία, την ιδιότητα του πολίτη και τη διαπολιτισμική μάθηση.",
    approachTitle: "Η Εκπαιδευτική μας Προσέγγιση",
    principles: [
      "Η γλώσσα ως σκόπιμη δράση",
      "Αλληλεπίδραση και διαμεσολάβηση",
      "Διερεύνηση και μάθηση βασισμένη σε έργα",
      "Ανατροφοδότηση και μεταγνώση",
      "Πολυτροπικός και ψηφιακός γραμματισμός",
      "Δημιουργικότητα σε όλους τους κλάδους",
      "Συμπεριληπτική συμμετοχή",
    ],
    eventsTitle: "Εκδηλώσεις",
    tabUpcoming: "Προσεχείς",
    tabArchive: "Παρελθόν / Αρχείο",
    filterAll: "Όλα",
    categoryLabels: {
      "Student events": "Εκδηλώσεις μαθητών",
      "Professional learning": "Επαγγελματική μάθηση",
      "Family and community learning": "Μάθηση για οικογένειες & κοινότητα",
      "International exchange": "Διεθνής ανταλλαγή",
    },
    categoryHints: {
      "Student events": "Ομιλίες TED-Ed, ντιμπέιτ, podcasts, προγράμματα ανάγνωσης",
      "Professional learning": "Συνέδρια, εργαστήρια, ακαδημίες, ανταλλαγή ομότιμων",
      "Family and community learning": "Webinars, συζητήσεις, κοινωνικά προγράμματα",
      "International exchange": "Δράσεις Erasmus+, συναντήσεις συνεργασίας",
    },
    audienceLabel: "Για",
    languageLabel: "Γλώσσα",
    registerLabel: "Εγγραφή / Περισσότερα",
    emptyUpcoming: "Δεν υπάρχουν προσεχείς εκδηλώσεις αυτή τη στιγμή. Παρακαλούμε ελάτε ξανά σύντομα.",
    emptyArchive: "Δεν υπάρχουν ακόμη αρχειοθετημένες εκδηλώσεις.",
    emptyFiltered: "Δεν υπάρχουν εκδηλώσεις σε αυτή την κατηγορία αυτή τη στιγμή.",
  },
};

function formatDate(value: string | null | undefined, lang: Lang): string {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function EventCard({ event, archived }: { event: EventItem; archived: boolean }) {
  const { lang } = useLanguage();
  const t = DICT[lang];

  const title = lang === "el" ? event.title_el || event.title_en : event.title_en || event.title_el;
  const date =
    formatDate(event.event_date, lang) || (lang === "el" ? event.date_el : event.date_en);
  const location =
    event.location_or_online || (lang === "el" ? event.location_el : event.location_en);
  const audience = event.target_audience || "";
  const language = event.language || "";
  const purpose = event.educational_purpose || "";
  const category = (event.category ?? "") as Category | "";
  const categoryLabel = category && t.categoryLabels[category] ? t.categoryLabels[category] : category;

  return (
    <article className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {categoryLabel && (
        <span className="mb-3 w-fit rounded-full bg-brand-aubergine/10 px-3 py-1 text-xs font-bold text-brand-aubergine">
          {categoryLabel}
        </span>
      )}

      <h3 className="text-lg leading-snug font-bold text-slate-900">{title}</h3>

      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        {date && (
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0 text-brand-aubergine/70" />
            {date}
          </p>
        )}
        {location && (
          <p className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 shrink-0 text-brand-aubergine/70" />
            {location}
          </p>
        )}
        {audience && (
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {t.audienceLabel}: {audience}
          </p>
        )}
        {language && (
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {t.languageLabel}: {language}
          </p>
        )}
      </div>

      {purpose && (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{purpose}</p>
      )}

      {!archived && event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand-lime px-5 py-2.5 text-sm font-bold text-brand-aubergine shadow-sm transition-all hover:bg-brand-lime-dark"
        >
          {t.registerLabel}
          <ArrowIcon className="h-4 w-4" />
        </a>
      )}
    </article>
  );
}

export default function EventsCatalog({ events }: { events: EventItem[] }) {
  const { lang } = useLanguage();
  const t = DICT[lang];

  const [tab, setTab] = useState<"upcoming" | "archive">("upcoming");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    const byTab = events.filter((e) => (tab === "archive" ? e.is_archived === true : !e.is_archived));
    const byCategory = byTab.filter((e) => category === "all" || e.category === category);
    return [...byCategory].sort((a, b) => {
      const da = (a.event_date ?? "").trim();
      const db = (b.event_date ?? "").trim();
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return tab === "archive" ? db.localeCompare(da) : da.localeCompare(db);
    });
  }, [events, tab, category]);

  const emptyMessage =
    filtered.length > 0
      ? null
      : category !== "all"
        ? t.emptyFiltered
        : tab === "archive"
          ? t.emptyArchive
          : t.emptyUpcoming;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      {/* 1. HEADER & LEAD */}
      <header className="max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-brand-aubergine sm:text-4xl lg:text-5xl">
          {t.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">{t.intro}</p>
      </header>

      {/* 2. EDUCATIONAL APPROACH */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-aubergine sm:text-3xl">
          {t.approachTitle}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.principles.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm leading-relaxed font-semibold text-slate-700 sm:text-base">
                {p}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. EVENTS */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-aubergine sm:text-3xl">
          {t.eventsTitle}
        </h2>

        {/* Upcoming / Archive toggle */}
        <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {(["upcoming", "archive"] as const).map((key) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  active ? "bg-brand-aubergine text-white" : "text-slate-600 hover:text-brand-aubergine"
                }`}
              >
                {key === "upcoming" ? t.tabUpcoming : t.tabArchive}
              </button>
            );
          })}
        </div>

        {/* Category tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              category === "all"
                ? "bg-brand-lime text-brand-aubergine shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.filterAll}
          </button>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                title={t.categoryHints[c]}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-brand-lime text-brand-aubergine shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.categoryLabels[c]}
              </button>
            );
          })}
        </div>

        {category !== "all" && (
          <p className="mt-3 text-sm text-slate-500">{t.categoryHints[category]}</p>
        )}

        {/* Grid */}
        {emptyMessage ? (
          <p className="mt-12 text-center text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} archived={tab === "archive"} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
