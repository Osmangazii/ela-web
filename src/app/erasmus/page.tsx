"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface Impact {
  title: string;
  note: string;
}

interface Copy {
  badge: string;
  heroTitle: string;
  heroDesc: string;
  q1: string;
  q2: string;
  projectsTitle: string;
  projTitle: string;
  code: string;
  action: string;
  projDesc: string;
  impacts: Impact[];
}

const DICT: Record<Lang, Copy> = {
  en: {
    badge: "European Collaboration & Horizons",
    heroTitle: "Connecting Educators Across Europe",
    heroDesc:
      "ELA is committed to international excellence. We invite European researchers, educators, and institutions to co-create innovative educational programs in digitalization, active citizenship, and sustainable learning.",
    q1: "Developing joint educational programs with a European perspective?",
    q2: "Sharing best practices and expertise with cross-border colleagues?",
    projectsTitle: "Funded Erasmus+ Projects",
    projTitle: "ELA: Promoting Sustainable and Innovative Environments in Adult Education",
    code: "2022-1-EL01-KA122-ADU-000071519",
    action: "Key Action 1: Learning Mobility (KA122-ADU)",
    projDesc:
      "A flagship mobility initiative aimed at fostering an entrepreneurial mindset in adult education. Our core educators completed specialized training abroad, directly transferring innovative pedagogical methodologies to circa 250 educators across Greece.",
    impacts: [
      { title: "250+ Educators Trained", note: "Methods transferred across Greece" },
      { title: "Mobility & Upskilling", note: "Specialized training abroad" },
      { title: "Sustainable Curriculum", note: "Innovative adult-education methodology" },
    ],
  },
  el: {
    badge: "Ευρωπαϊκές Συνεργασίες & Ορίζοντες",
    heroTitle: "Συνδέοντας την Εκπαίδευση σε όλη την Ευρώπη",
    heroDesc:
      "Ο ELA ενισχύει τη διεθνή συνεργασία. Προσκαλούμε ερευνητές, εκπαιδευτικούς και φορείς από την Ευρώπη να συνδημιουργήσουμε καινοτόμα προγράμματα για την ψηφιοποίηση, την ενεργό πολιτειότητα και τη βιώσιμη μάθηση.",
    q1: "Ανάπτυξη κοινών εκπαιδευτικών προγραμμάτων με ευρωπαϊκή προοπτική;",
    q2: "Ανταλλαγή βέλτιστων πρακτικών και τεχνογνωσίας σε ευρωπαϊκό επίπεδο;",
    projectsTitle: "Χρηματοδοτούμενα Προγράμματα Erasmus+",
    projTitle: "ELA: Προώθηση Βιώσιμων & Καινοτόμων Περιβαλλόντων στην Εκπαίδευση Ενηλίκων",
    code: "2022-1-EL01-KA122-ADU-000071519",
    action: "Βασική Δράση 1: Μαθησιακή Κινητικότητα (KA122-ADU)",
    projDesc:
      "Πρωτοβουλία κινητικότητας για την καλλιέργεια επιχειρηματικής κουλτούρας στην εκπαίδευση ενηλίκων. Τα στελέχη μας εκπαιδεύτηκαν στο εξωτερικό, διαχέοντας τις νέες μεθόδους σε περίπου 250 εκπαιδευτικούς σε όλη την Ελλάδα.",
    impacts: [
      { title: "250+ Εκπαιδευτικοί Επιμορφώθηκαν", note: "Διάχυση μεθόδων σε όλη την Ελλάδα" },
      { title: "Κινητικότητα & Αναβάθμιση", note: "Εξειδικευμένη εκπαίδευση στο εξωτερικό" },
      { title: "Βιώσιμο Εκπαιδευτικό Πρόγραμμα", note: "Καινοτόμα μεθοδολογία ενηλίκων" },
    ],
  },
};

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

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M12 2c.8 3 2.6 4.8 5.5 5.5-2.9.7-4.7 2.5-5.5 5.5-.8-3-2.6-4.8-5.5-5.5C9.4 6.8 11.2 5 12 2z" />
    </svg>
  );
}

export default function Erasmus() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      {/* HERO + PARTNERSHIP */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-brand-green uppercase shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
              {t.badge}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-brand-green sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {t.heroDesc}
            </p>
          </div>

          {/* Two static info boxes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <GlobeIcon />
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700">{t.q1}</p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <UsersIcon />
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700">{t.q2}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        {/* Featured project card */}
        <article className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                <GlobeIcon />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-brand-green sm:text-xl">
                {t.projectsTitle}
              </h2>
            </div>
            <EuFundingBadge />
          </div>

          {/* Middle: text + visual */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
                {t.action}
              </span>
              <h3 className="text-2xl font-black tracking-tight text-[#1b4332]">{t.projTitle}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{t.projDesc}</p>
              <span className="inline-block rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 font-mono text-xs font-bold text-slate-700">
                {t.code}
              </span>
            </div>

            <div className="flex w-full items-center justify-center p-4">
              <Image
                src="/erasmusela.png"
                alt="ELA Erasmus+ Project"
                width={480}
                height={480}
                className="h-auto w-full max-w-65 object-contain drop-shadow-md md:max-w-75"
              />
            </div>
          </div>

          {/* Bottom: 3 metrics */}
          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
            {t.impacts.map((imp, i) => (
              <div
                key={imp.title}
                className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                  {i === 0 ? <UsersIcon /> : i === 1 ? <GlobeIcon /> : <SparkIcon />}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{imp.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{imp.note}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
