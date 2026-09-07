"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/language-context";

interface EventItem {
  id: string;
  title: { en: string; el: string };
  date: { en: string; el: string };
  location: { en: string; el: string };
  themeColor: string; // Hex
  images: string[]; // 1..n
  col1: { en: string; el: string };
  col2: { en: string; el: string };
}

const EVENTS: EventItem[] = [
  {
    id: "launching",
    themeColor: "#165823",
    title: {
      en: "Official ELA Launching & Annual General Assembly",
      el: "Επίσημη Παρουσίαση ELA & Ετήσια Γενική Συνέλευση",
    },
    date: { en: "January 2019", el: "Ιανουάριος 2019" },
    location: { en: "Athens, Impact Hub", el: "Αθήνα, Impact Hub" },
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    ],
    col1: {
      en: "ELA stepped into the education world with an official launch in front of publishers, academics, and school owners. Founding member schools gathered to set a shared vision for quality, creativity, and leadership in foreign language education.",
      el: "Ο ELA έκανε το πρώτο του βήμα στον εκπαιδευτικό κόσμο με μια επίσημη παρουσίαση ενώπιον εκδοτών, ακαδημαϊκών και ιδιοκτητών σχολείων. Τα ιδρυτικά σχολεία-μέλη ενώθηκαν για να ορίσουν ένα κοινό όραμα ποιότητας, δημιουργικότητας και ηγεσίας στην ξενόγλωσση εκπαίδευση.",
    },
    col2: {
      en: "That same season, our first Annual General Assembly turned that vision into structure — welcoming member schools, electing a board, and agreeing on the quality standards that still guide the association today.",
      el: "Την ίδια περίοδο, η πρώτη Ετήσια Γενική Συνέλευση μετέτρεψε το όραμα σε δομή — υποδεχόμενη τα σχολεία-μέλη, εκλέγοντας διοικητικό συμβούλιο και συμφωνώντας στα πρότυπα ποιότητας που καθοδηγούν τον Σύνδεσμο μέχρι σήμερα.",
    },
  },
  {
    id: "kickstarter",
    themeColor: "#1E4E5F",
    title: {
      en: "ELA Kickstarter 2020 & Leadership Masterclass",
      el: "ELA Kickstarter 2020 & Masterclass Ηγεσίας",
    },
    date: { en: "February 2020", el: "Φεβρουάριος 2020" },
    location: { en: "Athens", el: "Αθήνα" },
    images: [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
    ],
    col1: {
      en: "More than fifty educators came together for the ELA Kickstarter 2020, kicking off the year with energy and purpose. The day featured a leadership masterclass with Karen Dunn and a warm welcome to new member schools.",
      el: "Πάνω από πενήντα εκπαιδευτικοί συγκεντρώθηκαν για το ELA Kickstarter 2020, ξεκινώντας τη χρονιά με ενέργεια και σκοπό. Η ημέρα περιλάμβανε masterclass ηγεσίας με την Karen Dunn και θερμή υποδοχή των νέων σχολείων-μελών.",
    },
    col2: {
      en: "Beyond celebration, the event set the stage for the very first ELA Youth Summit — preparing a season built on mentorship, creativity, and student leadership across our network.",
      el: "Πέρα από τον εορτασμό, η εκδήλωση άνοιξε τον δρόμο για το πρώτο ELA Youth Summit — προετοιμάζοντας μια σεζόν χτισμένη στην καθοδήγηση, τη δημιουργικότητα και τη μαθητική ηγεσία σε όλο το δίκτυό μας.",
    },
  },
  {
    id: "mentors",
    themeColor: "#4B164C",
    title: {
      en: "Inquiry-Based Learning & 100mentors",
      el: "Διερευνητική Μάθηση & 100mentors",
    },
    date: { en: "May 2020", el: "Μάιος 2020" },
    location: { en: "Online Webinar", el: "Διαδικτυακό Σεμινάριο" },
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    ],
    col1: {
      en: "When the world moved online, ELA moved with it. Through the 100mentors platform, we connected member schools' students with real, experienced mentors from across fields — turning distance into opportunity.",
      el: "Όταν ο κόσμος μετακινήθηκε διαδικτυακά, ο ELA ακολούθησε. Μέσω της πλατφόρμας 100mentors συνδέσαμε τους μαθητές των σχολείων-μελών με πραγματικούς, έμπειρους μέντορες από διαφορετικούς τομείς — μετατρέποντας την απόσταση σε ευκαιρία.",
    },
    col2: {
      en: "The webinar introduced inquiry-based learning approaches and demonstrated how genuine mentorship can sit at the heart of modern language education, even — and especially — from a screen.",
      el: "Το σεμινάριο παρουσίασε προσεγγίσεις διερευνητικής μάθησης και έδειξε πώς η γνήσια καθοδήγηση μπορεί να βρίσκεται στην καρδιά της σύγχρονης γλωσσικής εκπαίδευσης, ακόμα — και κυρίως — μέσα από μια οθόνη.",
    },
  },
  {
    id: "weme",
    themeColor: "#8C2D19",
    title: {
      en: "1st TED-ed #WEME",
      el: "1ο TED-ed #WEME",
    },
    date: { en: "March 2023", el: "Μάρτιος 2023" },
    location: { en: "Athens, Benaki Museum", el: "Αθήνα, Μουσείο Μπενάκη" },
    images: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=80",
    ],
    col1: {
      en: "Seventeen teenage speakers, one packed museum, and an audience full of hope. The 1st TED-ed #WEME live event brought young voices from across Greece onto one stage for the very first time.",
      el: "Δεκαεπτά έφηβοι ομιλητές, ένα κατάμεστο μουσείο και ένα κοινό γεμάτο ελπίδα. Το 1ο live event του TED-ed #WEME έφερε για πρώτη φορά νέες φωνές από όλη την Ελλάδα σε μία σκηνή.",
    },
    col2: {
      en: "Special guest talks, student performances, beatbox workshops, and a closing show by rapper SASKE turned the Benaki Museum into a celebration of youth, courage, and the power of being heard.",
      el: "Οι ξεχωριστές ομιλίες, οι μαθητικές παραστάσεις, τα beatbox workshops και το κλείσιμο με τον ράπερ SASKE μετέτρεψαν το Μουσείο Μπενάκη σε μια γιορτή της νεότητας, του θάρρους και της δύναμης του να σε ακούν.",
    },
  },
  {
    id: "globe",
    themeColor: "#4A151B",
    title: {
      en: "ELA Students at Shakespeare's Globe",
      el: "Μαθητές ELA στο Θέατρο Shakespeare's Globe",
    },
    date: { en: "June 2023", el: "Ιούνιος 2023" },
    location: { en: "London, Shakespeare's Globe", el: "Λονδίνο, Shakespeare's Globe" },
    images: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
    ],
    col1: {
      en: "A group of our most dedicated young English learners travelled to London for a once-in-a-lifetime experience at Shakespeare's Globe. Language, literature, and live theatre became one unforgettable classroom.",
      el: "Μια ομάδα από τους πιο αφοσιωμένους νέους μαθητές της αγγλικής ταξίδεψε στο Λονδίνο για μια μοναδική εμπειρία στο Shakespeare's Globe. Η γλώσσα, η λογοτεχνία και το ζωντανό θέατρο έγιναν μια αξέχαστη τάξη.",
    },
    col2: {
      en: "Standing on the same boards where Shakespeare's words first came alive, our students discovered that English is far more than a subject — it is a door to culture, confidence, and the wider world.",
      el: "Στέκοντας στα ίδια σανίδια όπου ζωντάνεψαν για πρώτη φορά τα λόγια του Σαίξπηρ, οι μαθητές μας ανακάλυψαν ότι τα αγγλικά είναι κάτι πολύ περισσότερο από ένα μάθημα — είναι μια πόρτα στον πολιτισμό, την αυτοπεποίθηση και τον ευρύτερο κόσμο.",
    },
  },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

/* Renders a single image as a showcase, or an interactive mini-gallery when multiple */
function EventMedia({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;
  const multi = count > 1;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl shadow-lg lg:w-125">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 500px, 100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-500 ${i === idx ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {multi && (
        <>
          <span className="absolute top-3 right-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-bold text-white">
            {idx + 1}/{count}
          </span>

          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIdx((v) => (v === 0 ? count - 1 : v - 1))}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-transparent p-0"
          >
            <svg className="h-8 w-8 text-slate-800 drop-shadow-sm transition-colors hover:text-brand-pink sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIdx((v) => (v + 1) % count)}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent p-0"
          >
            <svg className="h-8 w-8 text-slate-800 drop-shadow-sm transition-colors hover:text-brand-pink sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-5 bg-brand-pink" : "w-2 bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventStory({ ev, index }: { ev: EventItem; index: number }) {
  const { lang } = useLanguage();
  const title = ev.title[lang];
  const wavePath = "M0,0 L600,80 L1200,0 L1200,120 L0,120 Z";

  return (
    <div>
      {/* Stage 1 — light title / visual area (zig-zag direction) */}
      <section
        className={`mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 px-6 pb-16 pt-16 md:pt-24 ${
          index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="max-w-xl">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-base font-semibold text-slate-500">{ev.date[lang]}</p>
          <p className="mt-4 flex items-center gap-2 font-medium text-slate-700">
            <PinIcon />
            {ev.location[lang]}
          </p>
        </div>

        <EventMedia images={ev.images} alt={title} />
      </section>

      {/* Full-width angled wave into the deep color block */}
      <div className="-mb-px w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ fill: ev.themeColor }} className="relative block h-12 w-full md:h-20">
          <path d={wavePath} />
        </svg>
      </div>

      {/* Stage 2 — thematic color body with a flat bottom edge */}
      <section style={{ backgroundColor: ev.themeColor }} className="w-full px-6 pt-16 pb-16 text-white md:pb-20">
        <div className="mx-auto mb-6 max-w-5xl">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white/90 uppercase">
            {lang === "en" ? "Highlights & Impact" : "Στιγμιότυπα & Αντίκτυπος"} • {title}
          </span>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-base leading-relaxed font-normal text-white/90 md:grid-cols-2">
          <p>{ev.col1[lang]}</p>
          <p>{ev.col2[lang]}</p>
        </div>
      </section>
    </div>
  );
}

export default function Events() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      <main>
        <header className="mx-auto max-w-5xl px-6 pt-32 pb-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-pink-light bg-white px-4 py-1.5 text-xs font-bold tracking-wider text-brand-green uppercase shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
            {lang === "en" ? "A Story of Events" : "Μια Ιστορία Εκδηλώσεων"}
          </span>
        </header>

        {EVENTS.map((ev, index) => (
          <EventStory key={ev.id} ev={ev} index={index} />
        ))}
      </main>
    </div>
  );
}
