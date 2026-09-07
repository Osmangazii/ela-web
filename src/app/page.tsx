"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface Copy {
  badge: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  description: string;
  tags: string[];
  ctaPrimary: string;
  ctaSecondary: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    badge: "Recognized Education Network",
    titleBefore: "Empowering ",
    titleAccent: "Next-Gen",
    titleAfter: " Educational Leaders",
    description:
      "We equip educators and schools with forward-thinking programs, proven methodologies, and a thriving European community of partners.",
    tags: [
      "Erasmus+ Accredited",
      "Creative Methodologies",
      "30+ Member Schools",
      "Youth Development",
    ],
    ctaPrimary: "Explore Programs",
    ctaSecondary: "Meet Our Members",
  },
  el: {
    badge: "Αναγνωρισμένο Εκπαιδευτικό Δίκτυο",
    titleBefore: "Ενδυναμώνουμε τους ",
    titleAccent: "Ηγέτες",
    titleAfter: " της Νέας Γενιάς",
    description:
      "Εξοπλίζουμε εκπαιδευτικούς και σχολεία με καινοτόμα προγράμματα, αποδεδειγμένες μεθόδους και μια ζωντανή ευρωπαϊκή κοινότητα συνεργατών.",
    tags: [
      "Πιστοποιημένο Erasmus+",
      "Δημιουργικές Μεθοδολογίες",
      "30+ Σχολεία-μέλη",
      "Ανάπτυξη Νέων",
    ],
    ctaPrimary: "Ανακαλύψτε Προγράμματα",
    ctaSecondary: "Γνωρίστε τα Μέλη μας",
  },
};

/* Minimal, single-color inline icons */
function TagIcon({ i }: { i: number }) {
  switch (i) {
    case 0: // Erasmus+ star badge
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M12 2l1.9 5.7 6 .1-4.8 3.6 1.8 5.8L12 13.9 7.1 17.2l1.8-5.8L4.1 7.8l6-.1L12 2z" />
        </svg>
      );
    case 1: // lightbulb
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M9 18h6M10 21.5h4" />
          <path d="M12 2.5a6 6 0 0 0-3.2 11.1c.7.4 1.2 1.2 1.2 2v.4h4v-.4c0-.8.5-1.6 1.2-2A6 6 0 0 0 12 2.5z" />
        </svg>
      );
    case 2: // school building
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M3 21h18M4.5 21V10L12 4.5 19.5 10v11" />
          <path d="M9 21v-6h6v6" />
          <path d="M12 8h.01" />
        </svg>
      );
    default: // sparkle / youth
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
          <path d="M12 2c.8 3 2.6 4.8 5.5 5.5-2.9.7-4.7 2.5-5.5 5.5-.8-3-2.6-4.8-5.5-5.5C9.4 6.8 11.2 5 12 2z" />
          <path d="M19 13c.5 1.9 1.6 3 3.5 3.5-1.9.5-3 1.6-3.5 3.5-.5-1.9-1.6-3-3.5-3.5 1.9-.5 3-1.6 3.5-3.5z" opacity=".7" />
        </svg>
      );
  }
}

export default function Home() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6">
        {/* Eyebrow badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-brand-green shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-brand-pink" aria-hidden>
            <path d="M12 2c.8 3 2.6 4.8 5.5 5.5-2.9.7-4.7 2.5-5.5 5.5-.8-3-2.6-4.8-5.5-5.5C9.4 6.8 11.2 5 12 2z" />
          </svg>
          {t.badge}
        </span>

        {/* Title */}
        <h1 className="mx-auto max-w-4xl text-4xl leading-[1.1] font-black tracking-tight text-brand-green sm:text-6xl lg:text-7xl">
          {t.titleBefore}
          <span className="text-brand-pink">{t.titleAccent}</span>
          {t.titleAfter}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl font-normal text-slate-600 text-lg sm:text-xl">
          {t.description}
        </p>

        {/* Tag cloud */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {t.tags.map((label, i) => (
            <span
              key={label}
              className="inline-flex cursor-default items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:scale-105 hover:border-brand-pink sm:text-sm"
            >
              <TagIcon i={i} />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="w-full rounded-full bg-brand-pink px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-[#ff657d] hover:shadow-md sm:w-auto"
          >
            {t.ctaPrimary}
          </a>
          <Link
            href="/who-we-are"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 font-bold text-brand-green shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
          >
            {t.ctaSecondary}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
