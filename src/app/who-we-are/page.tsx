"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

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

const CITY: Record<string, { en: string; el: string }> = {
  athens: { en: "Athens", el: "Αθήνα" },
  patras: { en: "Patras", el: "Πάτρα" },
  agrinio: { en: "Agrinio", el: "Αγρίνιο" },
  thessaloniki: { en: "Thessaloniki", el: "Θεσσαλονίκη" },
  larissa: { en: "Larissa", el: "Λάρισα" },
  heraklion: { en: "Heraklion", el: "Ηράκλειο" },
  volos: { en: "Volos", el: "Βόλος" },
  piraeus: { en: "Piraeus", el: "Πειραιάς" },
  chania: { en: "Chania", el: "Χανιά" },
  corfu: { en: "Corfu", el: "Κέρκυρα" },
  ioannina: { en: "Ioannina", el: "Ιωάννινα" },
};

const SCHOOL_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80",
];

interface School {
  key: string;
  name: string;
  initials: string;
  cityKey: string;
  category: "language" | "hub";
  founding: boolean;
}

const SCHOOLS: School[] = [
  { key: "koryfi", name: "Koryfi", initials: "K", cityKey: "athens", category: "language", founding: true },
  { key: "tsiavou", name: "Th. Tsiavou – Rapti", initials: "TR", cityKey: "patras", category: "hub", founding: true },
  { key: "varela", name: "Varela", initials: "V", cityKey: "agrinio", category: "language", founding: true },
  { key: "success", name: "Success", initials: "S", cityKey: "thessaloniki", category: "hub", founding: true },
  { key: "p5", name: "Partner School #5", initials: "P", cityKey: "larissa", category: "language", founding: false },
  { key: "p6", name: "Partner School #6", initials: "P", cityKey: "heraklion", category: "hub", founding: false },
  { key: "p7", name: "Partner School #7", initials: "P", cityKey: "volos", category: "language", founding: false },
  { key: "p8", name: "Partner School #8", initials: "P", cityKey: "piraeus", category: "hub", founding: false },
  { key: "p9", name: "Partner School #9", initials: "P", cityKey: "chania", category: "language", founding: false },
  { key: "p10", name: "Partner School #10", initials: "P", cityKey: "corfu", category: "hub", founding: false },
  { key: "p11", name: "Partner School #11", initials: "P", cityKey: "ioannina", category: "language", founding: false },
  { key: "p12", name: "Partner School #12", initials: "P", cityKey: "thessaloniki", category: "hub", founding: false },
];

export default function WhoWeAre() {
  const { lang } = useLanguage();
  const t = DICT[lang];

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
                <div className="relative z-0 rotate-1 rounded-4xl border border-brand-pink-light bg-white p-8 shadow-lg transition-transform duration-300 hover:rotate-0 hover:shadow-xl">
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
        <section id="members" className="mx-auto w-full max-w-7xl px-6 py-12 md:px-8">
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

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {SCHOOLS.map((school, i) => {
              const foundingIndex = school.founding
                ? SCHOOLS.filter((s) => s.founding).findIndex((s) => s.key === school.key)
                : -1;
              const cityLabel = CITY[school.cityKey][lang];
              return (
                <article key={school.key} className="group flex cursor-pointer flex-col bg-transparent">
                  <div className="relative mb-4 aspect-16/10 w-full cursor-pointer rounded-2xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:z-20">
                    <Image
                      src={SCHOOL_IMAGES[i % SCHOOL_IMAGES.length]}
                      alt={school.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="rounded-2xl object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {cityLabel}
                    </span>
                  </div>

                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink">
                    {cityLabel.toUpperCase()}
                  </p>
                  <h3 className="line-clamp-1 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-green">
                    {school.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed font-normal text-slate-600">
                    {school.founding
                      ? t.founding[foundingIndex]?.blurb
                      : t.partner[school.category]}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
