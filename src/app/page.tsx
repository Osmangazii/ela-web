"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface Pillar {
  title: string;
  text: string;
}

interface Copy {
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  pillarsKicker: string;
  pillarsTitle: string;
  pillars: Pillar[];
  closingTitle: string;
  closingText: string;
  closingExplore: string;
  closingCommunity: string;
  closingConnect: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    heroKicker: "Educational Leadership Association",
    heroTitle: "Changing the Face of Education",
    heroLead:
      "ELA is a nationwide community of innovative and forward-looking foreign language schools in Greece. We unite educational leadership, evidence-informed teaching and international collaboration to create learning that is rigorous, inclusive and connected to the world. Every learner should experience language as more than a school subject. It is a means to think, communicate, collaborate and participate with confidence.",
    ctaPrimary: "Discover ELA",
    ctaSecondary: "Find an ELA School",
    pillarsKicker: "Our Purpose",
    pillarsTitle: "What we stand for",
    pillars: [
      {
        title: "Education changes when educators learn together",
        text: "ELA is a professional community where school leaders and teachers learn from one another. We share practice, expertise and evidence so that good ideas travel between schools and classrooms.",
      },
      {
        title: "Quality that becomes visible in learning",
        text: "We work with schools to make quality visible: clear learning goals, thoughtful teaching, meaningful feedback and assessment, and a habit of continuous improvement.",
      },
      {
        title: "Learners as active participants",
        text: "Learners are active participants in their own education — investigating, creating, presenting and applying their language skills to real questions and real audiences.",
      },
      {
        title: "Learning connected to the world",
        text: "Language learning opens routes to people, cultures and opportunities. We build European collaboration so that learners and teachers connect beyond the classroom.",
      },
    ],
    closingTitle: "Better together",
    closingText:
      "A strong school can transform a learner's experience. A connected community of schools can extend that transformation much further. ELA brings people together so that better ideas move, develop and reach more classrooms.",
    closingExplore: "Explore Events",
    closingCommunity: "Meet Our Community",
    closingConnect: "Connect with ELA",
  },
  el: {
    heroKicker: "Ένωση Εκπαιδευτικής Ηγεσίας",
    heroTitle: "Αλλάζουμε το Πρόσωπο της Εκπαίδευσης",
    heroLead:
      "Η ELA είναι μια πανελλαδική κοινότητα καινοτόμων και μπροστά-σκεπτόμενων σχολείων ξένων γλωσσών στην Ελλάδα. Ενώνουμε την εκπαιδευτική ηγεσία, τη διδασκαλία που βασίζεται σε τεκμήρια και τη διεθνή συνεργασία, δημιουργώντας μάθηση που είναι απαιτητική, συμπεριληπτική και συνδεδεμένη με τον κόσμο. Κάθε μαθητής πρέπει να βιώνει τη γλώσσα ως κάτι περισσότερο από ένα σχολικό μάθημα. Είναι μέσο για να σκέφτεται, να επικοινωνεί, να συνεργάζεται και να συμμετέχει με αυτοπεποίθηση.",
    ctaPrimary: "Ανακαλύψτε την ELA",
    ctaSecondary: "Βρείτε ένα Σχολείο ELA",
    pillarsKicker: "Ο Σκοπός μας",
    pillarsTitle: "Σε τι πιστεύουμε",
    pillars: [
      {
        title: "Η εκπαίδευση αλλάζει όταν οι εκπαιδευτικοί μαθαίνουν μαζί",
        text: "Η ELA είναι μια επαγγελματική κοινότητα όπου διευθυντές και εκπαιδευτικοί μαθαίνουν ο ένας από τον άλλο. Μοιραζόμαστε πρακτικές, τεχνογνωσία και τεκμηρίωση, ώστε οι καλές ιδέες να ταξιδεύουν ανάμεσα σε σχολεία και τάξεις.",
      },
      {
        title: "Ποιότητα που γίνεται ορατή στη μάθηση",
        text: "Συνεργαζόμαστε με τα σχολεία για να γίνει η ποιότητα ορατή: σαφείς μαθησιακοί στόχοι, στοχαστική διδασκαλία, ουσιαστική ανατροφοδότηση και αξιολόγηση και συνήθεια διαρκούς βελτίωσης.",
      },
      {
        title: "Οι μαθητές ως ενεργοί συμμετέχοντες",
        text: "Οι μαθητές είναι ενεργοί συμμετέχοντες στη δική τους μάθηση — ερευνούν, δημιουργούν, παρουσιάζουν και εφαρμόζουν τις γλωσσικές τους δεξιότητες σε πραγματικά ερωτήματα και κοινά.",
      },
      {
        title: "Μάθηση συνδεδεμένη με τον κόσμο",
        text: "Η εκμάθηση γλωσσών ανοίγει δρόμους προς ανθρώπους, πολιτισμούς και ευκαιρίες. Χτίζουμε ευρωπαϊκή συνεργασία, ώστε μαθητές και εκπαιδευτικοί να συνδέονται πέρα από την τάξη.",
      },
    ],
    closingTitle: "Καλύτερα μαζί",
    closingText:
      "Ένα ισχυρό σχολείο μπορεί να μεταμορφώσει την εμπειρία ενός μαθητή. Μια συνδεδεμένη κοινότητα σχολείων μπορεί να επεκτείνει αυτή τη μεταμόρφωση πολύ πιο πέρα. Η ELA φέρνει τους ανθρώπους κοντά, ώστε καλύτερες ιδέες να κινούνται, να εξελίσσονται και να φτάνουν σε περισσότερες τάξεις.",
    closingExplore: "Εξερευνήστε Εκδηλώσεις",
    closingCommunity: "Γνωρίστε την Κοινότητά μας",
    closingConnect: "Συνδεθείτε με την ELA",
  },
};

function PillarIcon({ i }: { i: number }) {
  switch (i) {
    case 0: // community / people
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
          <path d="M17 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-3A3.5 3.5 0 0 0 7 18.5V20" />
          <circle cx="12" cy="8" r="3.2" />
          <path d="M20 20v-1.2a3.2 3.2 0 0 0-2.4-3.1M4 20v-1.2a3.2 3.2 0 0 1 2.4-3.1" />
        </svg>
      );
    case 1: // quality badge
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
          <circle cx="12" cy="9" r="6" />
          <path d="M12 6l0.9 1.8 2 0.3-1.4 1.4 0.3 2-1.8-0.9-1.8 0.9 0.3-2-1.4-1.4 2-0.3L12 6z" />
          <path d="M8.5 14L6 21l3-1.5 2 1.5-0.8-4" />
          <path d="M15.5 14L18 21l-3-1.5-2 1.5 0.8-4" />
        </svg>
      );
    case 2: // active learner / compass
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </svg>
      );
    default: // globe
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
  }
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark antialiased">
      <Navbar />

      <main className="w-full">
        {/* HERO */}
        <section className="w-full border-t-4 border-brand-yellow px-4 pt-32 pb-14 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-brand-yellow px-3.5 py-1.5 text-xs font-bold tracking-[0.15em] text-brand-dark uppercase shadow-sm">
            {t.heroKicker}
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl leading-[1.1] font-black tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <span aria-hidden className="mx-auto mt-5 block h-1.5 w-24 rounded-full bg-brand-yellow" />

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed font-normal text-slate-600 sm:text-lg">
            {t.heroLead}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/who-we-are"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-brand-pink-dark hover:shadow-md sm:w-auto"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/membership"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 font-bold text-brand-dark shadow-sm transition-all hover:bg-slate-50 sm:w-auto"
            >
              {t.ctaSecondary}
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* PILLARS */}
        <section id="purpose" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-brand-pink uppercase">
              {t.pillarsKicker}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
              {t.pillarsTitle}
            </h2>
          </header>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {t.pillars.map((p, i) => (
              <article
                key={p.title}
                className="group flex flex-col rounded-3xl border border-brand-dark/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/20 text-brand-dark">
                  <PillarIcon i={i} />
                </span>
                <h3 className="text-xl font-bold leading-snug text-brand-dark">{p.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-brand-yellow p-8 text-center text-brand-dark shadow-sm sm:p-12 lg:p-16">
            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl">{t.closingTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-brand-dark/80 sm:text-lg">{t.closingText}</p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/events"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-brand-pink-dark sm:w-auto"
                >
                  {t.closingExplore}
                </Link>
                <Link
                  href="/who-we-are"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-dark bg-white px-6 py-3 font-semibold text-brand-dark transition-all hover:bg-neutral-100 sm:w-auto"
                >
                  {t.closingCommunity}
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-dark bg-white px-6 py-3 font-semibold text-brand-dark transition-all hover:bg-neutral-100 sm:w-auto"
                >
                  {t.closingConnect}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
