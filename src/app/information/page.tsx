"use client";

import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface Copy {
  badge: string;
  title: string;
  subtitle: string;
  purposeTitle: string;
  purposeText: string;
  legalTitle: string;
  legalText: string;
  criteriaTitle: string;
  requirements: string[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    badge: "Legal Status & Bylaws",
    title: "Official Association Information",
    subtitle:
      "Established as 'ΕΝΩΣΗ ΚΑΙΝΟΤΟΜΩΝ ΕΚΠΑΙΔΕΥΤΗΡΙΩΝ' (Educational Leadership Association - ELA), a non-profit legal entity committed to upgrading private foreign language education.",
    purposeTitle: "Our Core Purpose",
    purposeText:
      "The aims of the Association are strictly non-profit, focused on elevating the quality of private foreign language education through creative methodologies, alternative approaches, and reliable educational systems for the direct benefit of pupils, parents, and educators.",
    legalTitle: "Membership Eligibility",
    legalText:
      "Natural or legal entities holding a valid operating license for a Foreign Language Center (FLC) or Educational Organization may register as recognized members.",
    criteriaTitle: "Membership Criteria (Article 6 Requirements)",
    requirements: [
      "Operating actively within foreign language education.",
      "Minimum 3 years of established operations.",
      "Academic expertise and specialization in leadership and language teaching.",
      "Certified and continuously trained academic staff.",
      "Active academic partnerships in Greece and across Europe.",
      "Strict adherence to professional ethics, integrity, and association codes.",
      "High prestige and proven student & community recognition.",
      "Official licensing by EOPPEP (National Agency for Qualifications).",
    ],
    ctaTitle: "Want to join our accredited network?",
    ctaText:
      "Bring your school into a community committed to quality, creativity, and leadership in education.",
    ctaButton: "Apply for Membership",
  },
  el: {
    badge: "Καταστατικό & Πληροφορίες",
    title: "Επίσημες Πληροφορίες Συνδέσμου",
    subtitle:
      "Ιδρύθηκε ως 'ΕΝΩΣΗ ΚΑΙΝΟΤΟΜΩΝ ΕΚΠΑΙΔΕΥΤΗΡΙΩΝ' (Educational Leadership Association - ELA), μη κερδοσκοπικό νομικό πρόσωπο ιδιωτικού δικαίου για την αναβάθμιση της ξενόγλωσσης εκπαίδευσης.",
    purposeTitle: "Ο Σκοπός μας",
    purposeText:
      "Οι σκοποί του Συνδέσμου είναι μη κερδοσκοπικοί και στοχεύουν στην ποιοτική αναβάθμιση της ιδιωτικής ξενόγλωσσης εκπαίδευσης μέσα από καινοτόμες μεθόδους, αξιόπιστα συστήματα και ουσιαστική υποστήριξη μαθητών, γονέων και εκπαιδευτικών.",
    legalTitle: "Μέλη του Συνδέσμου",
    legalText:
      "Δικαίωμα εγγραφής έχουν φυσικά ή νομικά πρόσωπα με νόμιμη άδεια ίδρυσης και λειτουργίας Κέντρου Ξένων Γλωσσών ή Εκπαιδευτικού Οργανισμού.",
    criteriaTitle: "Προϋποθέσεις Εισόδου (Άρθρο 6)",
    requirements: [
      "Ενεργή δραστηριότητα στον τομέα της ξενόγλωσσης εκπαίδευσης.",
      "Τουλάχιστον τριετής (3) συνεχής λειτουργία.",
      "Ακαδημαϊκή εξειδίκευση και κατάρτιση των διοικητικών στελεχών.",
      "Κατάλληλα εκπαιδευμένο και πιστοποιημένο διδακτικό προσωπικό.",
      "Εκπαιδευτικές συνεργασίες με φορείς στην Ελλάδα και το εξωτερικό.",
      "Τήρηση επαγγελματικής δεοντολογίας και εναρμόνιση με τους κανόνες του ELA.",
      "Αναγνωρισμένο κύρος και εμπιστοσύνη από την εκπαιδευτική κοινότητα.",
      "Επίσημη άδεια λειτουργίας από τον ΕΟΠΠΕΠ.",
    ],
    ctaTitle: "Θέλετε να ενταχθείτε στο διαπιστευμένο δίκτυό μας;",
    ctaText:
      "Φέρτε το σχολείο σας σε μια κοινότητα αφιερωμένη στην ποιότητα, τη δημιουργικότητα και την ηγεσία στην εκπαίδευση.",
    ctaButton: "Αίτηση Εγγραφής",
  },
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
      <path d="M12 8v4M12 15.5h.01" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Information() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      {/* HERO */}
      <header className="mx-auto max-w-5xl px-6 pt-32 pb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-brand-green uppercase shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
          {t.badge}
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-brand-green sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {t.subtitle}
        </p>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        {/* Purpose & Legal cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-brand-pink-light bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink-light/70 text-brand-green">
              <ShieldIcon />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-brand-green">
              {t.purposeTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{t.purposeText}</p>
          </section>

          <section className="rounded-2xl border border-brand-pink-light bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pink-light/70 text-brand-green">
              <DocumentIcon />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-brand-green">
              {t.legalTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{t.legalText}</p>
          </section>
        </div>

        {/* Requirements checklist */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
            {t.criteriaTitle}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {t.requirements.map((req) => (
              <article
                key={req}
                className="flex items-start gap-4 rounded-2xl border border-brand-pink-light bg-white p-5 shadow-sm transition-colors hover:border-brand-pink"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/10 p-1 text-brand-green">
                  <CheckIcon />
                </span>
                <p className="pt-0.5 leading-relaxed text-slate-700">{req}</p>
              </article>
            ))}
          </div>
        </section>

        {/* End CTA */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">{t.ctaText}</p>
            <a
              href="#"
              className="mt-7 inline-block rounded-full bg-brand-pink px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-[#ff657d] hover:shadow-md active:scale-95"
            >
              {t.ctaButton}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
