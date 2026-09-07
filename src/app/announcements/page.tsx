"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

type Category = "all" | "official" | "event" | "article";

interface Post {
  id: string;
  date: string;
  category: Exclude<Category, "all">;
  author?: { en: string; el: string };
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
}

const CATEGORY_LABEL: Record<Lang, Record<Exclude<Category, "all">, string>> = {
  en: {
    official: "Official Notice",
    article: "Article & Thoughts",
    event: "Event Program",
  },
  el: {
    official: "Επίσημη Ανακοίνωση",
    article: "Άρθρο & Ιδέες",
    event: "Πρόγραμμα Εκδήλωσης",
  },
};

const FILTER_TABS: Record<Lang, { key: Category; label: string }[]> = {
  en: [
    { key: "all", label: "All" },
    { key: "official", label: "Official Notices" },
    { key: "article", label: "Articles & Thoughts" },
    { key: "event", label: "Events" },
  ],
  el: [
    { key: "all", label: "Όλα" },
    { key: "official", label: "Επίσημα" },
    { key: "article", label: "Άρθρα" },
    { key: "event", label: "Εκδηλώσεις" },
  ],
};

const POSTS: Post[] = [
  {
    id: "ga-2026",
    date: "May 22, 2026",
    category: "official",
    title: {
      en: "Invitation to Annual General Assembly",
      el: "Πρόσκληση σε Ετήσια Γενική Συνέλευση",
    },
    excerpt: {
      en: "A formal call to all members for the Association's annual ordinary general assembly, including the official agenda items and meeting details.",
      el: "Επίσημη πρόσκληση προς όλα τα μέλη για την ετήσια τακτική γενική συνέλευση του Συνδέσμου, με την ημερήσια διάταξη και τις λεπτομέρειες της συνεδρίασης.",
    },
  },
  {
    id: "teded-dare-2024",
    date: "March 27, 2024",
    category: "event",
    title: {
      en: "TED-Ed DARE 2024 Program Schedule",
      el: "Πρόγραμμα TED-ED DARE 2024",
    },
    excerpt: {
      en: "Official schedule and performance details for the TED-Ed DARE 2024 youth conference.",
      el: "Το επίσημο πρόγραμμα και οι λεπτομέρειες των παρουσιάσεων του συνεδρίου νέων TED-ED DARE 2024.",
    },
  },
  {
    id: "ai-teachers",
    date: "February 13, 2023",
    category: "article",
    author: { en: "Kostas Panagiotopoulos", el: "Κώστας Παναγιωτόπουλος" },
    title: {
      en: "Can Artificial Intelligence (AI) Replace Teachers?",
      el: "Μπορεί η Τεχνητή Νοημοσύνη να αντικαταστήσει τους εκπαιδευτικούς;",
    },
    excerpt: {
      en: "Exploring the rise of AI tools in modern education and why human emotional mentorship and creative teaching will remain irreplaceable.",
      el: "Διερεύνηση της ανόδου των εργαλείων ΤΝ στη σύγχρονη εκπαίδευση και γιατί η ανθρώπινη συναισθηματική καθοδήγηση και η δημιουργική διδασκαλία θα παραμείνουν αναντικατάστατες.",
    },
  },
  {
    id: "bite-sized",
    date: "April 4, 2022",
    category: "article",
    author: { en: "Kostas Panagiotopoulos", el: "Κώστας Παναγιωτόπουλος" },
    title: {
      en: "Time for Bite-sized Learning",
      el: "Η ώρα για τη Μικρομάθηση (Bite-sized Learning)",
    },
    excerpt: {
      en: "How modular and bite-sized learning approaches enhance student engagement in the digital era.",
      el: "Πώς οι αρθρωτές και μικρές μορφές μάθησης ενισχύουν την ενεργό συμμετοχή των μαθητών στην ψηφιακή εποχή.",
    },
  },
  {
    id: "critical-friends",
    date: "January 18, 2022",
    category: "article",
    author: { en: "Patritsia Andrioti", el: "Πατρίτσια Ανδριώτη" },
    title: {
      en: "Who Needs Critical Friends in Teaching?",
      el: "Ποιος χρειάζεται έναν Κριτικό Φίλο στη διδασκαλία;",
    },
    excerpt: {
      en: "The art of pedagogical reflection, self-analysis, and constructive peer feedback for continuous teacher development.",
      el: "Η τέχνη της παιδαγωγικής αναστοχαστικότητας, της αυτοανάλυσης και της εποικοδομητικής ανατροφοδότησης για τη διαρκή εξέλιξη των εκπαιδευτικών.",
    },
  },
  {
    id: "board-2022",
    date: "January 18, 2022",
    category: "official",
    title: {
      en: "Board of Directors Announcement",
      el: "Σύνθεση Διοικητικού Συμβουλίου",
    },
    excerpt: {
      en: "Official announcement of the elected ELA Board of Directors and key representatives.",
      el: "Επίσημη ανακοίνωση της σύνθεσης του εκλεγμένου Διοικητικού Συμβουλίου του ELA και των βασικών εκπροσώπων.",
    },
  },
];

export default function Announcements() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filtered = POSTS.filter((p) => selectedCategory === "all" || p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

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

        {/* Horizontal feed list */}
        <div className="mx-auto mt-10 max-w-5xl divide-y divide-slate-200/80 px-0">
          {filtered.map((post) => (
            <a
              key={post.id}
              href="#"
              className="group flex cursor-pointer flex-col justify-between rounded-2xl px-4 py-6 transition-all duration-200 hover:bg-white/80 md:flex-row md:items-center"
            >
              {/* Left: date & category */}
              <div className="md:w-1/4">
                <p className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-brand-green">
                  {post.date}
                </p>
                <span className="mt-1 inline-block rounded-full bg-brand-pink-light/50 px-2.5 py-0.5 text-xs font-bold text-brand-green">
                  {CATEGORY_LABEL[lang][post.category]}
                </span>
              </div>

              {/* Middle: title, excerpt, author */}
              <div className="mt-3 md:w-2/3 md:mt-0">
                <h3 className="text-lg leading-snug font-bold text-slate-900 transition-colors group-hover:text-brand-pink sm:text-xl">
                  {post.title[lang]}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-600 sm:line-clamp-2">
                  {post.excerpt[lang]}
                </p>
                {post.author && (
                  <p className="mt-1 text-xs text-slate-400">
                    {lang === "en" ? "By" : "Από"} {post.author[lang]}
                  </p>
                )}
              </div>

              {/* Right: arrow action */}
              <div className="mt-4 flex justify-end md:mt-0 md:w-auto">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all group-hover:border-brand-pink group-hover:bg-brand-pink group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-slate-500">
            {lang === "en" ? "No items in this category yet." : "Δεν υπάρχουν ακόμα στοιχεία σε αυτή την κατηγορία."}
          </p>
        )}
      </main>
    </div>
  );
}
