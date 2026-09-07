"use client";

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
  questionKicker: string;
  q1: string;
  q2: string;
  projectsTitle: string;
  projTitle: string;
  code: string;
  action: string;
  projDesc: string;
  impacts: Impact[];
  ctaTitle: string;
  ctaDesc: string;
  ctaButton: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    badge: "European Collaboration & Horizons",
    heroTitle: "Connecting Educators Across Europe",
    heroDesc:
      "ELA is committed to international excellence. We invite European researchers, educators, and institutions to co-create innovative educational programs in digitalization, active citizenship, and sustainable learning.",
    questionKicker: "Do you want to collaborate?",
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
    ctaTitle: "Partner with ELA for Next Calls",
    ctaDesc:
      "Bring your institution into our next European mobility or partnership project.",
    ctaButton: "Contact European Desk",
  },
  el: {
    badge: "Ευρωπαϊκές Συνεργασίες & Ορίζοντες",
    heroTitle: "Συνδέοντας την Εκπαίδευση σε όλη την Ευρώπη",
    heroDesc:
      "Ο ELA ενισχύει τη διεθνή συνεργασία. Προσκαλούμε ερευνητές, εκπαιδευτικούς και φορείς από την Ευρώπη να συνδημιουργήσουμε καινοτόμα προγράμματα για την ψηφιοποίηση, την ενεργό πολιτειότητα και τη βιώσιμη μάθηση.",
    questionKicker: "Θέλετε να συνεργαστούμε;",
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
    ctaTitle: "Συνεργαστείτε με τον ELA",
    ctaDesc:
      "Φέρτε τον φορέα σας στο επόμενο ευρωπαϊκό πρόγραμμα κινητικότητας ή συνεργασίας μας.",
    ctaButton: "Επικοινωνία",
  },
};

function EuBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#003399] px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#FFCC00]" aria-hidden>
        <path d="M12 2l1.3 3 3.2-.2-2.4 2.1.8 3.1L12 8.7 9.1 10l.8-3.1L7.5 4.8l3.2.2z" />
      </svg>
      Erasmus+
    </span>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M3 7l5-2 6 2 5-2v7c0 2.5-1.5 4.5-4 5.5V21H9v-3.5C6.5 16.5 5 14.5 5 12V7z" />
    </svg>
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M12 2c.8 3 2.6 4.8 5.5 5.5-2.9.7-4.7 2.5-5.5 5.5-.8-3-2.6-4.8-5.5-5.5C9.4 6.8 11.2 5 12 2z" />
    </svg>
  );
}

function ImpactIcon({ i }: { i: number }) {
  if (i === 0) return <HandshakeIcon />;
  if (i === 1) return <GlobeIcon />;
  return <SparkIcon />;
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

          {/* Two interactive question cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[t.q1, t.q2].map((q) => (
              <div
                key={q}
                className="flex flex-col rounded-2xl border border-brand-pink-light bg-white p-6 shadow-sm transition-all hover:border-brand-pink"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink-light/70 text-brand-green">
                  <HandshakeIcon />
                </span>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-700">{q}</p>
                <span className="mt-4 text-xs font-bold tracking-wider text-brand-pink uppercase">
                  {t.questionKicker}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
          {t.projectsTitle}
        </h2>

        {/* Featured project card */}
        <article className="relative mt-8 overflow-hidden rounded-3xl border-2 border-brand-pink-light bg-white p-8 shadow-sm md:p-12">
          <div aria-hidden className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-brand-pink via-brand-pink-light to-brand-green" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <EuBadge />
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 font-mono text-xs font-bold text-slate-700">
              {t.code}
            </span>
          </div>

          <h3 className="mt-6 max-w-3xl text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
            {t.projTitle}
          </h3>

          <span className="mt-4 inline-block rounded-full bg-brand-green/10 px-3.5 py-1.5 text-xs font-bold text-brand-green">
            {t.action}
          </span>

          <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">{t.projDesc}</p>

          {/* Impact highlights */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.impacts.map((imp, i) => (
              <div
                key={imp.title}
                className="flex items-center gap-4 rounded-2xl border border-brand-pink-light bg-brand-bg p-5 transition-colors hover:border-brand-pink"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-pink shadow-sm">
                  <ImpactIcon i={i} />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-brand-green">{imp.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{imp.note}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Partner CTA */}
        <section className="mt-12 flex flex-col items-center justify-center gap-4 rounded-3xl border border-brand-pink-light bg-linear-to-r from-white to-brand-bg p-8 text-center md:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink-light/70 text-brand-pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
              <path d="M4 15V8l3-1 4 1 3-1v5c0 1.6-.9 3-2.4 3.8L11 17.5V21" />
              <path d="M20 9v7l-3 1-4-1-3 1v-5c0-1.6.9-3 2.4-3.8L13 6.5V3" />
            </svg>
          </span>
          <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
            {t.ctaTitle}
          </h2>
          <p className="max-w-xl text-slate-600">{t.ctaDesc}</p>
          <a
            href="#"
            className="mt-2 inline-block rounded-full bg-brand-pink px-8 py-3.5 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-[#ff657d]"
          >
            {t.ctaButton}
          </a>
        </section>
      </main>
    </div>
  );
}
