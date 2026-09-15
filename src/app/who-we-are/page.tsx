"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";
import { createClient } from "@/lib/supabase/client";
import type { SchoolItem } from "@/types/database";

interface Copy {
  // Hero + manifesto
  badge: string;
  title: string;
  paragraphs: [string, string];
  cta: string;
  statsKicker: string;
  stats: { num?: string; text: string }[];
  floatBadge: string;
  // Members
  membersKicker: string;
  membersTitleA: string;
  membersTitleB: string;
  membersSub: string;
  readMore: string;
  foundingTag: string;
  role: { language: string; hub: string };
  founding: { blurb: string }[];
  partner: { language: string; hub: string };
}

const DICT: Record<Lang, Copy> = {
  en: {
    title: "Empowering Young Minds to Shape Tomorrow's World",
    paragraphs: [
      "ELA was founded to elevate educational quality for students, teachers, and parents alike. We nurture dynamic learning environments through mentorship, empathy, and innovation—championing timeless values like respect, creativity, solidarity, and critical thinking.",
      "In a fast-changing world, our mission is to empower young minds to discover their true potential, ask bold questions, and shape their own future with confidence.",
    ],
    cta: "Meet our members",
    badge: "Welcome to ELA",
    statsKicker: "Our community at a glance",
    stats: [
      { num: "30+", text: "Member schools & language centers" },
      { text: "Inspiring teachers in every classroom" },
      { text: "Creative youth shaping tomorrow" },
    ],
    floatBadge: "Active Across Greece & Europe",
    membersKicker: "School Network",
    membersTitleA: "Our",
    membersTitleB: "Members",
    membersSub:
      "A dynamic community of language centers and educational hubs growing together.",
    readMore: "Read more",
    foundingTag: "Founding Member",
    role: { language: "Language Center", hub: "Educational Hub" },
    founding: [
      { blurb: "A forward-thinking language center championing creative, early-learner classrooms." },
      { blurb: "An experienced team blending classic teaching with modern, playful methods." },
      { blurb: "A community hub making language learning welcoming and hands-on for everyone." },
      { blurb: "A results-driven center turning ambitious young learners into confident leaders." },
    ],
    partner: {
      language: "Modern classes and certified teachers for every age.",
      hub: "Inspiring workshops and community programs for young learners.",
    },
  },
  el: {
    title: "Ενδυναμώνουμε τους Νέους να Διαμορφώσουν το Αύριο",
    paragraphs: [
      "Ο Σύνδεσμος Εκπαιδευτικής Ηγεσίας (ELA) ιδρύθηκε με σκοπό τη διαρκή αναβάθμιση της εκπαιδευτικής διαδικασίας για μαθητές, εκπαιδευτικούς και γονείς. Προάγουμε τη δημιουργικότητα, την αλληλεγγύη, την κριτική σκέψη και τη συνεργασία.",
      "Σε έναν κόσμο που αλλάζει με ραγδαίους ρυθμούς, αποστολή μας είναι να βοηθήσουμε τους νέους να συνειδητοποιήσουν τις δυνατότητές τους, να θέτουν τολμηρές ερωτήσεις και να χτίσουν το μέλλον τους με αυτοπεποίθηση.",
    ],
    cta: "Γνωρίστε τα μέλη μας",
    badge: "Καλωσορίσατε στην ELA",
    statsKicker: "Η κοινότητά μας με μια ματιά",
    stats: [
      { num: "30+", text: "Σχολεία-μέλη & κέντρα γλωσσών" },
      { text: "Εμπνευσμένοι εκπαιδευτικοί σε κάθε τάξη" },
      { text: "Δημιουργικοί νέοι που διαμορφώνουν το αύριο" },
    ],
    floatBadge: "Δραστήριοι σε Ελλάδα & Ευρώπη",
    membersKicker: "Το Δίκτυο των Σχολείων",
    membersTitleA: "Τα",
    membersTitleB: "Μέλη μας",
    membersSub:
      "Μια δυναμική κοινότητα κέντρων γλωσσών και εκπαιδευτικών κόμβων που μεγαλώνουμε μαζί.",
    readMore: "Διαβάστε περισσότερα",
    foundingTag: "Ιδρυτικό Μέλος",
    role: { language: "Κέντρο Γλωσσών", hub: "Εκπαιδευτικός Κόμβος" },
    founding: [
      { blurb: "Ένα πρωτοπόρο κέντρο γλωσσών που στηρίζει δημιουργικές τάξεις για μικρούς μαθητές." },
      { blurb: "Μια έμπειρη ομάδα που συνδυάζει την κλασική με τη σύγχρονη, διασκεδαστική διδασκαλία." },
      { blurb: "Ένας κόμβος της κοινότητας που κάνει την εκμάθηση γλωσσών φιλόξενη για όλους." },
      { blurb: "Ένα κέντρο με προσανατολισμό στα αποτελέσματα που μετατρέπει τους μαθητές σε σίγουρους ηγέτες." },
    ],
    partner: {
      language: "Σύγχρονα τμήματα και πιστοποιημένοι εκπαιδευτικοί για κάθε ηλικία.",
      hub: "Εμπνευσμένα εργαστήρια και προγράμματα για νέους μαθητές.",
    },
  },
};

export default function WhoWeAre() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("schools")
        .select("*")
        .order("order_index", { ascending: true });
      if (active) {
        setSchools((data as unknown as SchoolItem[]) ?? []);
        setLoadingSchools(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      {/* REFINED HERO + MANIFESTO */}
      <main className="w-full">
        <section className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-4xl border border-brand-pink-light bg-white p-8 shadow-sm md:p-14 lg:grid-cols-12">
            {/* soft decorative wash, on-palette only */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-pink-light/50 blur-3xl" />
              <span className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-green/5 blur-3xl" />
            </div>

            {/* LEFT — typography & manifesto */}
            <div className="relative lg:col-span-7">
              <span className="mb-4 inline-block rounded-full bg-brand-pink-light/60 px-3.5 py-1.5 text-xs font-bold tracking-wider text-brand-green uppercase">
                {t.badge}
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-brand-green md:text-5xl">
                {t.title}
              </h1>

              <div className="mt-6 mb-8 space-y-4 font-normal leading-relaxed text-slate-700 text-base md:text-lg">
                {t.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <a
                href="#members"
                className="inline-block w-fit rounded-full bg-brand-pink px-7 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#ff637b] hover:shadow-md active:scale-95"
              >
                {t.cta}
              </a>
            </div>

            {/* RIGHT — overlapping elegant cards */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto w-full max-w-md">
                {/* Main summary card */}
                <div className="relative z-0 rotate-1 overflow-hidden rounded-4xl border border-brand-pink-light bg-white p-8 shadow-lg transition-transform duration-300 hover:rotate-0 hover:shadow-xl">
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-4xl bg-linear-to-r from-brand-pink to-brand-pink-light" />

                  <div className="rounded-2xl bg-brand-bg p-6">
                    <p className="text-xs font-bold tracking-wider text-brand-green uppercase">
                      {t.statsKicker}
                    </p>
                    <ul className="mt-5 space-y-4">
                      {t.stats.map((s, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 flex h-3 w-3 shrink-0 rounded-full bg-brand-pink ring-4 ring-brand-pink-light" aria-hidden />
                          <p className="text-base font-semibold leading-snug text-slate-800">
                            {s.num && <span className="font-extrabold text-brand-green">{s.num} </span>}
                            {s.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center gap-3 rounded-full border border-brand-green/10 bg-brand-green/5 px-5 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-sm font-extrabold text-white">
                      ELA
                    </span>
                    <p className="text-sm font-semibold text-brand-green">Educational Leadership Association</p>
                  </div>
                </div>

                {/* Floating mini badge */}
                <div className="absolute -bottom-6 -left-4 z-10 -rotate-3 sm:-left-8">
                  <div className="float-slow flex items-center gap-2.5 rounded-full border border-brand-green/10 bg-white py-2 pr-5 pl-2 shadow-lg">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4" aria-hidden>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold text-brand-green">{t.floatBadge}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBERS / SCHOOLS */}
        <section id="members" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <header className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-pink">
              {t.membersKicker}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-green sm:text-5xl">
              {t.membersTitleA} <span className="text-brand-pink">{t.membersTitleB}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-600">
              {t.membersSub}
            </p>
          </header>

          {loadingSchools ? (
            <p className="mt-16 text-center text-sm text-slate-500">
              {lang === "en" ? "Loading member schools…" : "Φόρτωση σχολείων-μελών…"}
            </p>
          ) : schools.length === 0 ? (
            <p className="mt-16 text-center text-sm text-slate-500">
              {lang === "en"
                ? "Member schools are being updated. Please check back soon."
                : "Τα σχολεία-μέλη ενημερώνονται. Παρακαλούμε ελάτε ξανά σύντομα."}
            </p>
          ) : (
            <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {schools.map((school) => {
                const name = (lang === "en" ? school.name_en : school.name_el) ?? school.name;
                const subtitle = (lang === "en" ? school.subtitle_en : school.subtitle_el) ?? "";
                const city = (lang === "en" ? school.city_en : school.city_el) ?? school.city;
                const status =
                  (lang === "en" ? school.member_status_en : school.member_status_el) ?? "";
                const description =
                  (lang === "en" ? school.description_en : school.description_el) ??
                  school.founder_info ??
                  "";
                const hasLongText = description.length > 80;
                return (
                  <article
                    key={school.id}
                    className="group flex min-h-105 flex-col items-center justify-between rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl lg:p-10"
                  >
                    <div className="relative mx-auto mb-6 flex aspect-square w-full max-w-70 items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-slate-50 p-3 sm:max-w-80">
                      {school.image_url ? (
                        <Image
                          src={school.image_url}
                          alt={name}
                          fill
                          sizes="(max-width: 768px) 100vw, 340px"
                          className="object-contain"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-brand-green">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex w-full flex-col items-center">
                      <h3 className="mt-0 mb-1 text-center text-2xl font-bold text-gray-900">{name}</h3>
                      {subtitle && (
                        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
                          {subtitle}
                        </p>
                      )}
                      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {city}
                      </p>
                      {status && (
                        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
                          {status}
                        </p>
                      )}
                      <p className="mb-4 line-clamp-3 overflow-hidden text-ellipsis text-center text-sm leading-relaxed text-gray-600">
                        {description}
                      </p>
                      <div className="min-h-6">
                        {hasLongText && (
                          <button
                            type="button"
                            onClick={() => setSelectedSchool(school)}
                            className="text-sm font-semibold text-red-600 hover:underline"
                          >
                            Read More
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* School detail modal */}
      {selectedSchool &&
        (() => {
          const s = selectedSchool;
          const name = (lang === "en" ? s.name_en : s.name_el) ?? s.name;
          const subtitle = (lang === "en" ? s.subtitle_en : s.subtitle_el) ?? "";
          const city = (lang === "en" ? s.city_en : s.city_el) ?? s.city;
          const status =
            (lang === "en" ? s.member_status_en : s.member_status_el) ?? "";
          const description =
            (lang === "en" ? s.description_en : s.description_el) ?? s.founder_info ?? "";
          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={name}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedSchool(null)}
            >
              <div
                className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-black/5 bg-white p-8 text-center shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedSchool(null)}
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-brand-pink hover:text-white"
                >
                  ✕
                </button>

                <div className="relative mx-auto mb-5 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-black/5 bg-slate-50 p-3">
                  {s.image_url ? (
                    <Image src={s.image_url} alt={name} fill sizes="200px" className="object-contain" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-brand-green">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                {subtitle && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {subtitle}
                  </p>
                )}
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#ff6b6b]">
                  {city}
                </p>
                {status && (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {status}
                  </p>
                )}
                <p className="mt-4 text-left text-base leading-relaxed text-gray-600">{description}</p>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
