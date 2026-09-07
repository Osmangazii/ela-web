"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface EventCopy {
  badge: string;
  title: string;
  date: string;
  location: string;
  description: string;
  sponsors: string[];
}

interface EventData {
  image: string;
  alt: string;
  content: Record<Lang, EventCopy>;
}

const EVENTS: EventData[] = [
  {
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    alt: "Young speakers on stage at a live youth event",
    content: {
      en: {
        badge: "TED-Ed Club / Youth Live Event",
        title: "1st TED-ed #WEME",
        date: "March 2023",
        location: "Athens, Benaki Museum",
        description:
          "The 1st live event of the ELA TED-Ed club at the packed Benaki Museum! Featuring 17 inspiring teenage speakers from all over Greece, special guest talks, live student performances, beatbox workshops, and an exclusive closing show by rapper SASKE.",
        sponsors: [
          "Hellenic American Union",
          "National Geographic Learning",
          "Burlington Books",
          "Macmillan Education",
          "Cambridge University Press",
          "Ancient Greek Sandals",
          "Coca Cola 3E",
        ],
      },
      el: {
        badge: "TED-Ed Club / Ζωντανή Εκδήλωση Νέων",
        title: "1ο TED-ed #WEME",
        date: "Μάρτιος 2023",
        location: "Αθήνα, Μουσείο Μπενάκη",
        description:
          "Το 1ο live event του TED-Ed club του ELA στο κατάμεστο Μουσείο Μπενάκη! 17 έφηβοι ομιλητές από όλη την Ελλάδα, guest speakers (Nefeli Meg, Πασχαλιά Μιτσικίδου), student performances, beatbox workshop και κλείσιμο με τον ράπερ SASKE.",
        sponsors: [
          "Hellenic American Union",
          "National Geographic Learning",
          "Burlington Books",
          "Macmillan Education",
          "Cambridge University Press",
          "Ancient Greek Sandals",
          "Coca Cola 3E",
        ],
      },
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    alt: "Audience at a conference hall event",
    content: {
      en: {
        badge: "Leadership Summit",
        title: "Annual Educational Leadership Forum 2024",
        date: "November 2024",
        location: "Thessaloniki Concert Hall",
        description:
          "Our annual gathering of educators, school owners, and education leaders. A full day of keynotes, panel discussions, and hands-on workshops exploring the future of leadership, innovation, and creative classrooms across Europe.",
        sponsors: ["Cambridge University Press", "Macmillan Education", "National Geographic Learning"],
      },
      el: {
        badge: "Σύνοδος Ηγεσίας",
        title: "Ετήσιο Συνέδριο Εκπαιδευτικής Ηγεσίας 2024",
        date: "Νοέμβριος 2024",
        location: "Μέγαρο Μουσικής Θεσσαλονίκης",
        description:
          "Η ετήσια συνάντησή μας εκπαιδευτικών, ιδιοκτητών σχολείων και ηγετών της εκπαίδευσης. Μια ολόκληρη ημέρα με ομιλίες, συζητήσεις πάνελ και βιωματικά εργαστήρια για το μέλλον της ηγεσίας, της καινοτομίας και των δημιουργικών τάξεων σε όλη την Ευρώπη.",
        sponsors: ["Cambridge University Press", "Macmillan Education", "National Geographic Learning"],
      },
    },
  },
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

export default function Events() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      <header className="mx-auto max-w-5xl px-6 pt-32 pb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-brand-green uppercase shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
          {lang === "en" ? "Events & Live Moments" : "Εκδηλώσεις & Ζωντανές Στιγμές"}
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-brand-green sm:text-5xl">
          {lang === "en" ? "Our Events" : "Οι Εκδηλώσεις μας"}
        </h1>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8 pb-20 sm:px-8">
        {EVENTS.map((event, i) => {
          const c = event.content[lang];
          const reversed = i % 2 === 1;
          return (
            <article
              key={c.title}
              className={`mb-16 flex flex-col items-center gap-8 rounded-3xl border border-brand-pink-light bg-white p-8 shadow-sm md:gap-12 lg:flex-row md:p-12 ${
                reversed ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image */}
              <div className="group relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-2xl shadow-md lg:w-1/2">
                <Image
                  src={event.image}
                  alt={event.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <span className="w-fit rounded-full bg-brand-pink-light/60 px-3 py-1 text-xs font-bold text-brand-green">
                  {c.badge}
                </span>

                <h2 className="mt-2 mb-4 text-3xl font-black tracking-tight text-brand-green sm:text-4xl">
                  {c.title}
                </h2>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                    <span className="text-brand-green">
                      <CalendarIcon />
                    </span>
                    {c.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                    <span className="text-brand-pink">
                      <PinIcon />
                    </span>
                    {c.location}
                  </span>
                </div>

                <p className="mt-4 leading-relaxed text-slate-600">{c.description}</p>

                <div className="mt-7 w-full border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lang === "en" ? "Supported by" : "Υποστηρικτές"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.sponsors.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
