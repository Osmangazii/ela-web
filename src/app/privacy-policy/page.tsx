"use client";

import Navbar from "@/components/Navbar";
import { useLanguage, type Lang } from "@/components/language-context";

interface Section {
  heading: string;
  body: string;
}

interface Copy {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
  contactBefore: string;
  contactAfter: string;
}

const EMAIL = "press@ela.edu.gr";

const DICT: Record<Lang, Copy> = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: 2026",
    intro:
      "This policy explains what data the Educational Leadership Association (ELA) handles, why we process it, and the rights you have over it.",
    sections: [
      {
        heading: "Data We Collect",
        body: "We process only the personal data you voluntarily share with us — for example your name, email address, or school details when you contact us or apply for membership.",
      },
      {
        heading: "Media & Cookies",
        body: "If you provide media, please avoid including embedded location data. We use only essential cookies to keep the site functional and to measure basic, anonymous usage.",
      },
      {
        heading: "Embedded Content",
        body: "Some pages may include embedded content (such as videos or posts) that behaves in the same way as if you had visited the third-party website. Those providers may collect data and use cookies under their own policies.",
      },
      {
        heading: "Your Data Rights",
        body: "You may request access to, correction of, or deletion of your personal data at any time. Where processing relies on consent, you are free to withdraw it.",
      },
      {
        heading: "Data Security",
        body: "We apply reasonable technical and organisational measures to protect your data. Please note that no method of online transmission is ever completely secure.",
      },
    ],
    contactBefore: "For any privacy question or request, reach us at",
    contactAfter: ".",
  },
  el: {
    title: "Πολιτική Απορρήτου",
    lastUpdated: "Τελευταία ενημέρωση: 2026",
    intro:
      "Η παρούσα πολιτική εξηγεί ποια δεδομένα επεξεργάζεται ο Σύνδεσμος Εκπαιδευτικής Ηγεσίας (ELA), γιατί τα επεξεργαζόμαστε και ποια δικαιώματα έχετε επ’ αυτών.",
    sections: [
      {
        heading: "Δεδομένα που Συλλέγουμε",
        body: "Επεξεργαζόμαστε μόνο τα προσωπικά δεδομένα που μοιράζεστε οικειοθελώς μαζί μας — για παράδειγμα όνομα, διεύθυνση ηλεκτρονικού ταχυδρομείου ή στοιχεία σχολείου όταν επικοινωνείτε ή υποβάλλετε αίτηση εγγραφής.",
      },
      {
        heading: "Μέσα & Cookies",
        body: "Εάν μας παρέχετε μέσα, παρακαλούμε να αποφεύγετε την ενσωμάτωση δεδομένων τοποθεσίας. Χρησιμοποιούμε μόνο απαραίτητα cookies για τη λειτουργία του ιστότοπου και βασικές, ανώνυμες μετρήσεις επισκεψιμότητας.",
      },
      {
        heading: "Ενσωματωμένο Περιεχόμενο",
        body: "Ορισμένες σελίδες μπορεί να περιλαμβάνουν ενσωματωμένο περιεχόμενο (π.χ. βίντεο ή αναρτήσεις) που συμπεριφέρεται όπως εάν επισκεπτόσασταν τον ιστότοπο τρίτου. Οι πάροχοι αυτοί ενδέχεται να συλλέγουν δεδομένα και να χρησιμοποιούν cookies σύμφωνα με τις δικές τους πολιτικές.",
      },
      {
        heading: "Τα Δικαιώματά σας επί των Δεδομένων",
        body: "Μπορείτε ανά πάσα στιγμή να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των προσωπικών σας δεδομένων. Όπου η επεξεργασία βασίζεται σε συγκατάθεση, μπορείτε να την ανακαλέσετε ελεύθερα.",
      },
      {
        heading: "Ασφάλεια Δεδομένων",
        body: "Εφαρμόζουμε εύλογα τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων σας. Σημειώστε ότι καμία μέθοδος διαδικτυακής μετάδοσης δεν είναι απολύτως ασφαλής.",
      },
    ],
    contactBefore: "Για οποιαδήποτε ερώτηση ή αίτημα απορρήτου, επικοινωνήστε μαζί μας στο",
    contactAfter: ".",
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-green antialiased">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        <h1 className="text-3xl font-extrabold text-brand-green">{t.title}</h1>

        <span className="mt-4 mb-8 inline-block w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          {t.lastUpdated}
        </span>

        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{t.intro}</p>

        {t.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mt-8 mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
              {s.heading}
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{s.body}</p>
          </section>
        ))}

        <section>
          <h2 className="mt-8 mb-3 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900">
            {lang === "en" ? "Contact" : "Επικοινωνία"}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            {t.contactBefore}{" "}
            <a href={`mailto:${EMAIL}`} className="font-semibold text-brand-pink underline hover:text-[#ff637b]">
              {EMAIL}
            </a>
            {t.contactAfter}
          </p>
        </section>
      </main>
    </div>
  );
}
