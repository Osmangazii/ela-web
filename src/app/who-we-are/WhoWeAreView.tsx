"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";
import type { BoardMember } from "@/types/database";

interface ValueItem {
  title: string;
  text: string;
}

interface Copy {
  title: string;
  lead: string[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  calloutTitle: string;
  calloutText: string;
  valuesTitle: string;
  values: ValueItem[];
  boardTitle: string;
  boardIntro: string;
  boardEmpty: string;
  contributionLabel: string;
}

const DICT: Record<Lang, Copy> = {
  en: {
    title: "A community built around educational purpose",
    lead: [
      "ELA is the Educational Leadership Association, a non-profit network of foreign language schools in Greece. Our members share a commitment to educational quality, professional ethics and the continuous development of teaching and leadership.",
      "Each member school has its own history, local community and educational identity. Through ELA, these schools learn with one another, develop joint programmes and connect their students and teachers with opportunities across Greece and Europe.",
    ],
    missionTitle: "Our mission",
    missionText:
      "Our mission is to strengthen the quality and social value of foreign language education. We connect schools, develop educators and create learning experiences informed by research, professional expertise and the needs of learners. Through shared practice, we help language education contribute to communication, critical thinking, creativity, inclusion and active citizenship.",
    visionTitle: "Our vision",
    visionText:
      "We envision learning communities in which every young person can use languages to make meaning, build relationships and engage with a complex world. We want teachers to belong to a profession that values inquiry and growth, and schools to become trusted centres of learning, culture and connection within their communities.",
    calloutTitle: "What Changing the Face of Education means to us",
    calloutText:
      "For ELA, educational change begins with what happens every day: the questions learners are invited to ask, the quality of the feedback they receive, the confidence with which they express an idea and the professional conversations that help teachers improve. Our motto is a commitment to sustained, responsible progress across the whole learning community.",
    valuesTitle: "Our values",
    values: [
      {
        title: "Quality with purpose",
        text: "We align educational goals, teaching, assessment and reflection so that progress is meaningful, visible and relevant to the learner.",
      },
      {
        title: "Learner agency",
        text: "We recognise learners as active participants who make choices, develop strategies and use language to accomplish real purposes.",
      },
      {
        title: "Professional inquiry",
        text: "Teachers and school leaders continue to learn. They examine evidence, exchange practice and refine their decisions in response to their learners.",
      },
      {
        title: "Collaboration",
        text: "Member schools contribute knowledge and build programmes together. Trust and shared responsibility allow strong ideas to travel across the network.",
      },
      {
        title: "Inclusion and belonging",
        text: "Learning environments should be safe, accessible and responsive to different strengths, identities and needs.",
      },
      {
        title: "Global outlook",
        text: "Language education develops intercultural understanding and connects local learning with European and worldwide perspectives.",
      },
    ],
    boardTitle: "Board of Directors",
    boardIntro:
      "ELA is governed by an elected Board of school leaders and educators who serve the association and its members. The Board sets strategic priorities, supports transparent decision-making and represents ELA in Greece and internationally.",
    boardEmpty: "Board member profiles are being updated. Please check back soon.",
    contributionLabel: "ELA contribution",
  },
  el: {
    title: "Μια κοινότητα χτισμένη γύρω από τον εκπαιδευτικό σκοπό",
    lead: [
      "Η ELA είναι ο Σύνδεσμος Εκπαιδευτικής Ηγεσίας, ένα μη κερδοσκοπικό δίκτυο σχολείων ξένων γλωσσών στην Ελλάδα. Τα μέλη μας μοιράζονται τη δέσμευση για εκπαιδευτική ποιότητα, επαγγελματική δεοντολογία και τη διαρκή ανάπτυξη της διδασκαλίας και της ηγεσίας.",
      "Κάθε σχολείο-μέλος έχει τη δική του ιστορία, τοπική κοινότητα και εκπαιδευτική ταυτότητα. Μέσω της ELA, αυτά τα σχολεία μαθαίνουν μεταξύ τους, αναπτύσσουν κοινά προγράμματα και συνδέουν μαθητές και εκπαιδευτικούς με ευκαιρίες σε όλη την Ελλάδα και την Ευρώπη.",
    ],
    missionTitle: "Η αποστολή μας",
    missionText:
      "Η αποστολή μας είναι να ενισχύσουμε την ποιότητα και την κοινωνική αξία της εκπαίδευσης ξένων γλωσσών. Συνδέουμε σχολεία, αναπτύσσουμε εκπαιδευτικούς και δημιουργούμε μαθησιακές εμπειρίες που βασίζονται στην έρευνα, την επαγγελματική τεχνογνωσία και τις ανάγκες των μαθητών. Μέσα από την κοινή πρακτική, βοηθάμε τη γλωσσική εκπαίδευση να συμβάλλει στην επικοινωνία, την κριτική σκέψη, τη δημιουργικότητα, την ένταξη και την ενεργό ιδιότητα του πολίτη.",
    visionTitle: "Το όραμά μας",
    visionText:
      "Οραματιζόμαστε μαθησιακές κοινότητες στις οποίες κάθε νέος μπορεί να χρησιμοποιεί τις γλώσσες για να δημιουργεί νόημα, να χτίζει σχέσεις και να συμμετέχει σε έναν σύνθετο κόσμο. Θέλουμε οι εκπαιδευτικοί να ανήκουν σε ένα επάγγελμα που τιμά τη διερεύνηση και την ανάπτυξη, και τα σχολεία να γίνονται αξιόπιστα κέντρα μάθησης, πολιτισμού και σύνδεσης μέσα στις κοινότητές τους.",
    calloutTitle: "Τι σημαίνει για εμάς το «Αλλάζουμε το Πρόσωπο της Εκπαίδευσης»",
    calloutText:
      "Για την ELA, η εκπαιδευτική αλλαγή ξεκινά από αυτό που συμβαίνει καθημερινά: τις ερωτήσεις που καλούνται να θέσουν οι μαθητές, την ποιότητα της ανατροφοδότησης που λαμβάνουν, την αυτοπεποίθηση με την οποία εκφράζουν μια ιδέα και τις επαγγελματικές συζητήσεις που βοηθούν τους εκπαιδευτικούς να βελτιωθούν. Το σύνθημά μας είναι δέσμευση για σταθερή, υπεύθυνη πρόοδο σε ολόκληρη τη μαθησιακή κοινότητα.",
    valuesTitle: "Οι αξίες μας",
    values: [
      {
        title: "Ποιότητα με σκοπό",
        text: "Ευθυγραμμίζουμε τους εκπαιδευτικούς στόχους, τη διδασκαλία, την αξιολόγηση και τον αναστοχασμό, ώστε η πρόοδος να είναι ουσιαστική, ορατή και σχετική για τον μαθητή.",
      },
      {
        title: "Πρωτοβουλία του μαθητή",
        text: "Αναγνωρίζουμε τους μαθητές ως ενεργούς συμμετέχοντες που κάνουν επιλογές, αναπτύσσουν στρατηγικές και χρησιμοποιούν τη γλώσσα για πραγματικούς σκοπούς.",
      },
      {
        title: "Επαγγελματική διερεύνηση",
        text: "Οι εκπαιδευτικοί και οι διευθυντές συνεχίζουν να μαθαίνουν. Εξετάζουν τεκμήρια, ανταλλάσσουν πρακτικές και βελτιώνουν τις αποφάσεις τους ανταποκρινόμενοι στους μαθητές τους.",
      },
      {
        title: "Συνεργασία",
        text: "Τα σχολεία-μέλη συνεισφέρουν γνώση και χτίζουν προγράμματα μαζί. Η εμπιστοσύνη και η κοινή ευθύνη επιτρέπουν στις καλές ιδέες να ταξιδεύουν στο δίκτυο.",
      },
      {
        title: "Ένταξη και ανήκειν",
        text: "Τα μαθησιακά περιβάλλοντα πρέπει να είναι ασφαλή, προσβάσιμα και προσαρμοσμένα σε διαφορετικές δυνάμεις, ταυτότητες και ανάγκες.",
      },
      {
        title: "Παγκόσμια οπτική",
        text: "Η γλωσσική εκπαίδευση αναπτύσσει τη διαπολιτισμική κατανόηση και συνδέει την τοπική μάθηση με ευρωπαϊκές και παγκόσμιες προοπτικές.",
      },
    ],
    boardTitle: "Διοικητικό Συμβούλιο",
    boardIntro:
      "Η ELA διοικείται από εκλεγμένο Διοικητικό Συμβούλιο σχολικών ηγετών και εκπαιδευτικών που υπηρετούν τον σύνδεσμο και τα μέλη του. Το Συμβούλιο θέτει στρατηγικές προτεραιότητες, στηρίζει τη διαφανή λήψη αποφάσεων και εκπροσωπεί την ELA στην Ελλάδα και διεθνώς.",
    boardEmpty: "Τα προφίλ των μελών του Διοικητικού Συμβουλίου ενημερώνονται. Παρακαλούμε ελάτε ξανά σύντομα.",
    contributionLabel: "Συνεισφορά στην ELA",
  },
};

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

function BoardMemberCard({ member, contributionLabel }: { member: BoardMember; contributionLabel: string }) {
  const schoolCity = [member.school_name, member.city].filter(Boolean).join(" | ");
  return (
    <article className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative mb-5 aspect-square w-28 overflow-hidden rounded-2xl border border-black/5 bg-slate-50">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.full_name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-brand-aubergine">
            {member.full_name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900">{member.full_name}</h3>
      {member.position && (
        <p className="mt-0.5 text-sm font-semibold text-brand-coral">{member.position}</p>
      )}
      {schoolCity && (
        <p className="mt-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">{schoolCity}</p>
      )}

      {member.profile_text && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{member.profile_text}</p>
      )}

      {member.ela_contribution && (
        <div className="mt-4 rounded-2xl border border-brand-aubergine/10 bg-brand-beige p-3">
          <p className="text-[11px] font-bold tracking-wider text-brand-aubergine uppercase">{contributionLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{member.ela_contribution}</p>
        </div>
      )}
    </article>
  );
}

export default function WhoWeAreView({ boardMembers }: { boardMembers: BoardMember[] }) {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-beige text-brand-aubergine antialiased">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        {/* 1. HEADER & LEAD */}
        <header className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight text-brand-aubergine sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </header>

        {/* 2. MISSION & VISION */}
        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-brand-aubergine/10 bg-white p-8 shadow-sm">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <CompassIcon className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-brand-aubergine">{t.missionTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{t.missionText}</p>
          </div>
          <div className="rounded-3xl border border-brand-aubergine/10 bg-white p-8 shadow-sm">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <EyeIcon className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-brand-aubergine">{t.visionTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{t.visionText}</p>
          </div>
        </section>

        {/* 3. CALLOUT / SPOTLIGHT */}
        <section className="mt-14">
          <div className="relative overflow-hidden rounded-4xl bg-brand-aubergine p-8 text-white shadow-sm sm:p-12">
            <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-coral/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t.calloutTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">{t.calloutText}</p>
            </div>
          </div>
        </section>

        {/* 4. VALUES */}
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-aubergine sm:text-4xl">
            {t.valuesTitle}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.values.map((v) => (
              <article
                key={v.title}
                className="flex flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-coral/10 text-brand-coral">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 5. BOARD OF DIRECTORS */}
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-aubergine sm:text-4xl">
            {t.boardTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{t.boardIntro}</p>

          {boardMembers.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">{t.boardEmpty}</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boardMembers.map((member) => (
                <BoardMemberCard key={member.id} member={member} contributionLabel={t.contributionLabel} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
