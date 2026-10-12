"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";
import type { SchoolItem } from "@/types/database";

interface Copy {
  title: string;
  lead: string[];
  offersTitle: string;
  offers: string[];
  eligibilityTitle: string;
  eligibilityText: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  directoryTitle: string;
  directoryEmpty: string;
  readMore: string;
  country: string;
  close: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    title: "Stronger schools through shared learning",
    lead: [
      "ELA membership brings foreign language schools into a professional community committed to quality, ethical practice and continuous development. Members contribute experience, questions and ideas. In return, they gain trusted colleagues, shared programmes and structured opportunities to learn and collaborate.",
      "The value of the network grows through participation. A conversation between school leaders can become a professional learning activity; a classroom idea can develop into a national programme; a European partnership can bring new knowledge into schools across Greece.",
    ],
    offersTitle: "What membership offers",
    offers: [
      "A trusted peer community of school leaders from different regions of Greece.",
      "Professional learning for owners, directors and teaching teams.",
      "Participation in shared student programmes and collaborative educational initiatives.",
      "Opportunities to contribute to Erasmus+ projects and wider international partnerships.",
      "Exchange of practice, resources and experience across the member network.",
      "Visibility through the member directory, events and editorial stories.",
      "A collective voice for high-quality private foreign language education.",
    ],
    eligibilityTitle: "Who can apply",
    eligibilityText:
      "Membership is open to licensed Foreign Language Centres and educational organisations that meet ELA's formal entry requirements. These include at least three years of operation, qualified leadership, appropriately trained staff, professional ethics, recognised quality, collaboration with educational bodies and a valid EOPPEP licence. Applicants should review the current statutes and formal procedure before applying.",
    ctaTitle: "Begin a conversation with ELA",
    ctaText:
      "If your school values professional learning, responsible innovation and meaningful collaboration, we invite you to begin a conversation with ELA. Tell us about your educational work, your community and the contribution you hope to make to the network.",
    ctaPrimary: "Request Membership Information",
    ctaSecondary: "Meet Our Members",
    directoryTitle: "Our Member Schools",
    directoryEmpty: "The member directory is being updated. Please check back soon.",
    readMore: "Read more",
    country: "Greece",
    close: "Close",
  },
  el: {
    title: "Πιο δυνατά σχολεία μέσα από την κοινή μάθηση",
    lead: [
      "Η μελοσύνη της ELA εντάσσει τα σχολεία ξένων γλωσσών σε μια επαγγελματική κοινότητα που δεσμεύεται για ποιότητα, ηθική πρακτική και διαρκή ανάπτυξη. Τα μέλη συνεισφέρουν εμπειρία, ερωτήματα και ιδέες. Σε αντάλλαγμα, αποκτούν έμπιστους συναδέλφους, κοινά προγράμματα και οργανωμένες ευκαιρίες για μάθηση και συνεργασία.",
      "Η αξία του δικτύου μεγαλώνει μέσα από τη συμμετοχή. Μια συζήτηση μεταξύ σχολικών ηγετών μπορεί να γίνει επαγγελματική δραστηριότητα μάθησης· μια ιδέα από την τάξη μπορεί να εξελιχθεί σε εθνικό πρόγραμμα· μια ευρωπαϊκή σύμπραξη μπορεί να φέρει νέα γνώση σε σχολεία σε όλη την Ελλάδα.",
    ],
    offersTitle: "Τι προσφέρει η μελοσύνη",
    offers: [
      "Μια έμπιστη κοινότητα ομοτίμων σχολικών ηγετών από διαφορετικές περιοχές της Ελλάδας.",
      "Επαγγελματική μάθηση για ιδιοκτήτες, διευθυντές και διδακτικές ομάδες.",
      "Συμμετοχή σε κοινά προγράμματα μαθητών και συνεργατικές εκπαιδευτικές πρωτοβουλίες.",
      "Ευκαιρίες συμμετοχής σε έργα Erasmus+ και ευρύτερες διεθνείς συνεργασίες.",
      "Ανταλλαγή πρακτικών, πόρων και εμπειρίας σε όλο το δίκτυο των μελών.",
      "Προβολή μέσα από τον κατάλογο μελών, τις εκδηλώσεις και τις εκδοτικές ιστορίες.",
      "Συλλογική φωνή για υψηλής ποιότητας ιδιωτική εκπαίδευση ξένων γλωσσών.",
    ],
    eligibilityTitle: "Ποιοι μπορούν να υποβάλουν αίτηση",
    eligibilityText:
      "Η μελοσύνη είναι ανοικτή σε αδειοδοτημένα Κέντρα Ξένων Γλωσσών και εκπαιδευτικούς οργανισμούς που πληρούν τις επίσημες προϋποθέσεις εισόδου της ELA. Αυτές περιλαμβάνουν τουλάχιστον τρία έτη λειτουργίας, καταρτισμένη ηγεσία, κατάλληλα εκπαιδευμένο προσωπικό, επαγγελματική δεοντολογία, αναγνωρισμένη ποιότητα, συνεργασία με εκπαιδευτικούς φορείς και έγκυρη άδεια ΕΟΠΠΕΠ. Οι ενδιαφερόμενοι καλό είναι να μελετήσουν το ισχύον καταστατικό και την επίσημη διαδικασία πριν υποβάλουν αίτηση.",
    ctaTitle: "Ξεκινήστε μια συζήτηση με την ELA",
    ctaText:
      "Αν το σχολείο σας εκτιμά την επαγγελματική μάθηση, την υπεύθυνη καινοτομία και τη γόνιμη συνεργασία, σας προσκαλούμε να ξεκινήσετε μια συζήτηση με την ELA. Πείτε μας για το εκπαιδευτικό σας έργο, την κοινότητά σας και τη συμβολή που ελπίζετε να προσφέρετε στο δίκτυο.",
    ctaPrimary: "Ζητήστε Πληροφορίες Μελοσύνης",
    ctaSecondary: "Γνωρίστε τα Μέλη μας",
    directoryTitle: "Τα Σχολεία-μέλη μας",
    directoryEmpty: "Ο κατάλογος μελών ενημερώνεται. Παρακαλούμε ελάτε ξανά σύντομα.",
    readMore: "Διαβάστε περισσότερα",
    country: "Ελλάδα",
    close: "Κλείσιμο",
  },
};

const CONTACT_HREF = "mailto:membership@ela.edu.gr";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c.8 3 2.6 4.8 5.5 5.5-2.9.7-4.7 2.5-5.5 5.5-.8-3-2.6-4.8-5.5-5.5C9.4 6.8 11.2 5 12 2z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

interface SchoolCopy {
  name: string;
  subtitle: string;
  city: string;
  status: string;
  description: string;
}

function schoolCopy(school: SchoolItem, lang: Lang): SchoolCopy {
  return {
    name: (lang === "en" ? school.name_en : school.name_el) ?? school.name,
    subtitle: (lang === "en" ? school.subtitle_en : school.subtitle_el) ?? "",
    city: (lang === "en" ? school.city_en : school.city_el) ?? school.city,
    status: (lang === "en" ? school.member_status_en : school.member_status_el) ?? "",
    description:
      (lang === "en" ? school.description_en : school.description_el) ?? school.founder_info ?? "",
  };
}

function SchoolLogo({ school, name, sizes }: { school: SchoolItem; name: string; sizes: string }) {
  if (school.image_url) {
    return (
      <Image src={school.image_url} alt={name} fill sizes={sizes} className="object-contain" />
    );
  }
  return (
    <span className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-brand-green">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/** Read-only dialog with the full, untruncated school profile. */
function SchoolModal({ school, onClose }: { school: SchoolItem; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = DICT[lang];
  const s = schoolCopy(school, lang);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={s.name}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-black/5 bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t.close}
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-brand-pink hover:text-white"
        >
          ✕
        </button>

        {/* Full logo banner */}
        <div className="relative mx-auto mb-6 flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl">
          <SchoolLogo school={school} name={s.name} sizes="320px" />
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900">{s.name}</h3>
          {s.subtitle && (
            <p className="mt-1 text-xs font-semibold tracking-widest text-gray-400 uppercase">
              {s.subtitle}
            </p>
          )}
          <p className="mt-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            {s.city}, {t.country}
          </p>
          {s.status && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-pink-light/60 px-3 py-1 text-xs font-bold text-brand-green">
              <StarIcon className="h-3 w-3 text-brand-pink" />
              {s.status}
            </span>
          )}
        </div>

        {s.description && (
          <p className="mt-6 text-left text-base leading-relaxed text-slate-600">{s.description}</p>
        )}
      </div>
    </div>
  );
}

function MemberSchoolCard({ school, onOpen }: { school: SchoolItem; onOpen: () => void }) {
  const { lang } = useLanguage();
  const t = DICT[lang];
  const s = schoolCopy(school, lang);

  return (
    <article className="group relative flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* Full-card click target */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${t.readMore}: ${s.name}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
      />

      {/* Prominent logo banner */}
      <div className="relative mb-5 flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl">
        <SchoolLogo school={school} name={s.name} sizes="(max-width: 768px) 100vw, 320px" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">{s.name}</h3>
      {s.subtitle && (
        <p className="mt-0.5 text-xs font-semibold tracking-widest text-gray-400 uppercase">
          {s.subtitle}
        </p>
      )}
      <p className="mt-0.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">{s.city}</p>

      {s.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        {s.status ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-pink-light/60 px-3 py-1 text-xs font-bold text-brand-green">
            <StarIcon className="h-3 w-3 text-brand-pink" />
            {s.status}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-pink">
          {t.readMore}
          <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}

export default function MembershipView({ schools }: { schools: SchoolItem[] }) {
  const { lang } = useLanguage();
  const t = DICT[lang];

  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        {/* 1. HEADER & LEAD */}
        <header className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight text-brand-green sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </header>

        {/* 2. WHAT MEMBERSHIP OFFERS */}
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-green sm:text-4xl">
            {t.offersTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {t.offers.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-slate-700 sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. WHO CAN APPLY */}
        <section className="mt-14">
          <div className="rounded-4xl border border-brand-pink-light bg-white p-8 shadow-sm sm:p-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl">
              {t.eligibilityTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-600">
              {t.eligibilityText}
            </p>
          </div>
        </section>

        {/* 4. CALL TO ACTION */}
        <section className="mt-14">
          <div className="relative overflow-hidden rounded-4xl bg-brand-green p-8 text-white shadow-sm sm:p-12">
            <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-pink/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t.ctaTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{t.ctaText}</p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <a
                  href={CONTACT_HREF}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-pink px-7 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#ff657d] sm:w-auto"
                >
                  {t.ctaPrimary}
                </a>
                <a
                  href="#members"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("members")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3 font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
                >
                  {t.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MEMBER DIRECTORY */}
        <section id="members" className="mt-14 scroll-mt-28">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-green sm:text-4xl">
            {t.directoryTitle}
          </h2>

          {schools.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">{t.directoryEmpty}</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <MemberSchoolCard key={school.id} school={school} onOpen={() => setSelectedSchool(school)} />
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedSchool && (
        <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />
      )}
    </div>
  );
}
