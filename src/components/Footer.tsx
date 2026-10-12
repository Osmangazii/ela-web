"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage, type Lang } from "@/components/language-context";

const COPY: Record<Lang, { mission: string; links: { label: string; href: string }[]; contactTitle: string; contactLabel: string; rights: string; privacy: string }> = {
  en: {
    mission:
      "Empowering young minds and the educators who guide them — together across Greece and Europe.",
    links: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Information", href: "/information" },
      { label: "Events", href: "/events" },
      { label: "Erasmus+", href: "/erasmus" },
    ],
    contactTitle: "Get in touch",
    contactLabel: "Press & partnerships",
    rights: "Copyright © 2026 Educational Leadership Association. All rights reserved.",
    privacy: "Privacy Policy",
  },
  el: {
    mission:
      "Ενδυναμώνουμε τους νέους και τους εκπαιδευτικούς που τους καθοδηγούν — μαζί σε όλη την Ελλάδα και την Ευρώπη.",
    links: [
      { label: "Ποιοι Είμαστε", href: "/who-we-are" },
      { label: "Πληροφορίες", href: "/information" },
      { label: "Εκδηλώσεις", href: "/events" },
      { label: "Erasmus+", href: "/erasmus" },
    ],
    contactTitle: "Επικοινωνία",
    contactLabel: "Τύπος & συνεργασίες",
    rights: "Πνευματικά δικαιώματα © 2026 Educational Leadership Association. Με επιφύλαξη παντός δικαιώματος.",
    privacy: "Πολιτική Απορρήτου",
  },
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M14 9h3l.5-3H14V4.5c0-.9.2-1.5 1.6-1.5H18V.2C17.5.1 16.6 0 15.6 0 13.2 0 11.5 1.4 11.5 4v2H9v3h2.5v9H14V9z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const { lang } = useLanguage();
  const t = COPY[lang];

  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/fulllogoela.svg"
                alt="ELA Logo"
                width={160}
                height={44}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{t.mission}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/60">
              {lang === "en" ? "Quick Links" : "Γρήγοροι Σύνδεσμοι"}
            </p>
            <ul className="mt-4 space-y-2.5">
              {t.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-white/80 transition-colors hover:text-brand-pink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & social */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/60">{t.contactTitle}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/50">{t.contactLabel}</p>
            <a
              href="mailto:press@ela.edu.gr"
              className="mt-1 inline-block text-base font-semibold text-white transition-colors hover:text-brand-pink"
            >
              press@ela.edu.gr
            </a>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-pink"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-pink"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>{t.rights}</p>
          <Link href="/privacy-policy" className="transition-colors hover:text-white">
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
