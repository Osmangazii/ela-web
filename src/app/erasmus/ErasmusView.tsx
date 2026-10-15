"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";
import type { ErasmusProject } from "@/types/database";
import { erasmusStatusLabel, formatErasmusDateRange, splitList } from "@/lib/erasmus";

interface Impact {
  title: string;
  note: string;
}

interface Tab {
  key: TabKey;
  label: string;
}

type TabKey = "all" | "Active" | "Call for Partners" | "Completed";

interface Copy {
  heroTitle: string;
  heroDesc: string;
  strategicTitle: string;
  strategic: Impact[];
  portfolioTitle: string;
  tabs: Tab[];
  labelCountries: string;
  labelPriorities: string;
  labelResults: string;
  viewDetails: string;
  empty: string;
  partnerTitle: string;
  partnerText: string;
  partnerCta: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    heroTitle: "Connecting Educators Across Europe",
    heroDesc:
      "ELA is committed to international excellence. We invite European researchers, educators, and institutions to co-create innovative educational programs in digitalization, active citizenship, and sustainable learning.",
    strategicTitle: "Erasmus+ Vision & Strategic Scope",
    strategic: [
      { title: "Inclusion & Diversity", note: "Opportunities for every learner and community." },
      { title: "Digital Literacy", note: "Confident, critical use of digital tools." },
      { title: "Teacher Professional Development", note: "Mobility, upskilling and peer learning." },
      { title: "Green Transition", note: "Sustainable, environmentally aware education." },
    ],
    portfolioTitle: "Our Project Portfolio",
    tabs: [
      { key: "all", label: "All" },
      { key: "Active", label: "Active Projects" },
      { key: "Call for Partners", label: "Calls for Partnerships" },
      { key: "Completed", label: "Completed Projects / Results" },
    ],
    labelCountries: "Partner countries",
    labelPriorities: "Priorities",
    labelResults: "Results",
    viewDetails: "View Details / Download Summary",
    empty: "No projects in this category yet.",
    partnerTitle: "Call for Strategic Partnerships",
    partnerText:
      "Is your school or institution looking for European mobility, consortiums or KA2 partnerships? ELA welcomes new partners for Erasmus+ cooperation and consortium applications.",
    partnerCta: "Partner with ELA",
  },
  el: {
    heroTitle: "Συνδέοντας την Εκπαίδευση σε όλη την Ευρώπη",
    heroDesc:
      "Ο ELA ενισχύει τη διεθνή συνεργασία. Προσκαλούμε ερευνητές, εκπαιδευτικούς και φορείς από την Ευρώπη να συνδημιουργήσουμε καινοτόμα προγράμματα για την ψηφιοποίηση, την ενεργό πολιτειότητα και τη βιώσιμη μάθηση.",
    strategicTitle: "Όραμα Erasmus+ & Στρατηγικό Πεδίο",
    strategic: [
      { title: "Συμπερίληψη & Διαφορετικότητα", note: "Ευκαιρίες για κάθε μαθητή και κοινότητα." },
      { title: "Ψηφιακός Γραμματισμός", note: "Σίγουρη και κριτική χρήση ψηφιακών εργαλείων." },
      { title: "Επαγγελματική Ανάπτυξη Εκπαιδευτικών", note: "Κινητικότητα, επιμόρφωση και ομότιμη μάθηση." },
      { title: "Πράσινη Μετάβαση", note: "Βιώσιμη, περιβαλλοντικά υπεύθυνη εκπαίδευση." },
    ],
    portfolioTitle: "Το Χαρτοφυλάκιο Έργων μας",
    tabs: [
      { key: "all", label: "Όλα" },
      { key: "Active", label: "Ενεργά Προγράμματα" },
      { key: "Call for Partners", label: "Προσκλήσεις Συνεργασίας" },
      { key: "Completed", label: "Ολοκληρωμένα / Αποτελέσματα" },
    ],
    labelCountries: "Χώρες εταίροι",
    labelPriorities: "Προτεραιότητες",
    labelResults: "Αποτελέσματα",
    viewDetails: "Λεπτομέρειες / Λήψη Σύνοψης",
    empty: "Δεν υπάρχουν έργα σε αυτή την κατηγορία ακόμη.",
    partnerTitle: "Πρόσκληση για Στρατηγικές Συνεργασίες",
    partnerText:
      "Το σχολείο ή ο φορέας σας αναζητά ευρωπαϊκή κινητικότητα, κοινοπραξίες ή συμπράξεις KA2; Η ELA καλωσορίζει νέους εταίρους για συνεργασία και αιτήσεις Erasmus+.",
    partnerCta: "Συνεργαστείτε με την ELA",
  },
};

const PARTNER_HREF = "mailto:erasmus@ela.edu.gr";

function EuFundingBadge() {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 shadow-sm">
      <Image
        src="/euroflag.svg"
        alt="European Union Flag"
        width={32}
        height={22}
        className="h-auto w-8 rounded-sm object-contain shadow-sm"
      />
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Erasmus+
        </span>
        <span className="text-xs font-bold text-slate-900">
          Co-funded by the European Union
        </span>
      </div>
    </div>
  );
}

function GlobeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z" />
    </svg>
  );
}

function UsersIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MonitorIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function CapIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
    </svg>
  );
}

function LeafIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 4c0 9-5 13-12 13H5c0-7 4-11 11-11 2 0 3-.5 4-2z" />
      <path d="M4 20c1.5-4 4.5-7 9-9" />
    </svg>
  );
}

function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

const STRATEGIC_ICONS = [UsersIcon, MonitorIcon, CapIcon, LeafIcon];

function statusClasses(status: string): string {
  if (status === "Active") return "bg-emerald-50 text-emerald-700";
  if (status === "Call for Partners") return "bg-brand-yellow font-semibold text-brand-dark";
  if (status === "Completed") return "bg-slate-100 text-slate-600";
  return "bg-slate-100 text-slate-600";
}

function ProjectCard({ project }: { project: ErasmusProject }) {
  const { lang } = useLanguage();
  const t = DICT[lang];

  const status = project.status ?? "";
  const countries = splitList(project.partner_countries);
  const priorities = splitList(project.priorities);
  const period = formatErasmusDateRange(project.start_date, project.end_date, lang);

  return (
    <article className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:p-8">
      {/* Header: badges */}
      <div className="flex flex-wrap items-center gap-2">
        {status && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses(status)}`}>
            {erasmusStatusLabel(status, lang)}
          </span>
        )}
        {project.action_type && (
          <span className="rounded-full border border-brand-cyan/50 bg-brand-cyan/15 px-3 py-1 text-xs font-semibold text-brand-dark">
            {project.action_type}
          </span>
        )}
      </div>

      {/* Prominent title */}
      <h3 className="mt-4 text-xl leading-snug font-black tracking-tight text-slate-900 sm:text-2xl">
        {project.title}
      </h3>

      {/* Metadata row: project code + period */}
      {(project.project_code || period) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {project.project_code && (
            <span className="inline-block rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
              {project.project_code}
            </span>
          )}
          {period && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <CalendarIcon className="h-3.5 w-3.5" />
              {period}
            </span>
          )}
        </div>
      )}

      {/* Full summary (no truncation) */}
      {project.summary && (
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{project.summary}</p>
      )}

      {/* Results (when present) */}
      {project.results_summary && (
        <div className="mt-4 rounded-2xl border border-brand-dark/10 bg-brand-beige p-4">
          <p className="text-[11px] font-bold tracking-wider text-brand-dark uppercase">
            {t.labelResults}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{project.results_summary}</p>
        </div>
      )}

      {/* Partner countries + priorities */}
      {(countries.length > 0 || priorities.length > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {countries.length > 0 && (
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t.labelCountries}
              </p>
              <p className="mt-1 text-sm text-slate-600">{countries.join(", ")}</p>
            </div>
          )}
          {priorities.length > 0 && (
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {t.labelPriorities}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {priorities.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-brand-cyan/20 px-2.5 py-0.5 text-xs font-semibold text-brand-dark"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary CTA, pinned to the bottom */}
      {project.attachment_url && (
        <div className="mt-6 flex flex-1 items-end">
          <a
            href={project.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-pink hover:text-white"
          >
            {t.viewDetails}
          </a>
        </div>
      )}
    </article>
  );
}

export default function ErasmusView({ projects }: { projects: ErasmusProject[] }) {
  const { lang } = useLanguage();
  const t = DICT[lang];
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = useMemo(
    () => projects.filter((p) => tab === "all" || (p.status ?? "") === tab),
    [projects, tab],
  );

  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark antialiased">
      <Navbar />

      {/* HERO + STRATEGIC SCOPE */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-brand-dark sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{t.heroDesc}</p>
            <div className="mt-6">
              <EuFundingBadge />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-pink uppercase">
              {t.strategicTitle}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {t.strategic.map((s, i) => {
                const Icon = STRATEGIC_ICONS[i] ?? GlobeIcon;
                return (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-cyan/20 text-brand-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-brand-dark">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        {/* PROJECT PORTFOLIO (DB-driven) */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">
            {t.portfolioTitle}
          </h2>

          {/* Status filter tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {t.tabs.map((tb) => {
              const active = tab === tb.key;
              return (
                <button
                  key={tb.key}
                  type="button"
                  onClick={() => setTab(tb.key)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    active
                      ? "bg-brand-pink text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tb.label}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-500">{t.empty}</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

        {/* CALL FOR STRATEGIC PARTNERSHIPS */}
        <section className="mt-14">
          <div className="relative overflow-hidden rounded-4xl bg-brand-dark p-8 text-white shadow-sm sm:p-12">
            <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-cyan/25 blur-3xl" />
            <div className="relative max-w-3xl text-white">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{t.partnerTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{t.partnerText}</p>
              <a
                href={PARTNER_HREF}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-pink px-7 py-3 font-bold text-white shadow-sm transition-all hover:bg-brand-pink-dark"
              >
                {t.partnerCta}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
