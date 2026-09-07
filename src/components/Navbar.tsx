"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage, type Lang } from "./language-context";

interface Dictionary {
  links: { label: string; href: string }[];
  cta: string;
}

const DICTIONARY: Record<Lang, Dictionary> = {
  en: {
    links: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Information", href: "/information" },
      { label: "Events", href: "/events" },
      { label: "Announcements", href: "/announcements" },
      { label: "Erasmus+", href: "/erasmus" },
    ],
    cta: "Join Us",
  },
  el: {
    links: [
      { label: "Ποιοι Είμαστε", href: "/who-we-are" },
      { label: "Πληροφορίες", href: "/information" },
      { label: "Εκδηλώσεις", href: "/events" },
      { label: "Ανακοινώσεις", href: "/announcements" },
      { label: "Erasmus+", href: "/erasmus" },
    ],
    cta: "Εγγραφή",
  },
};

export default function Navbar() {
  const { lang: currentLang, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const dict = DICTIONARY[currentLang];

  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto w-[94%] max-w-6xl">
      <div className="flex h-16 items-center justify-between gap-4 rounded-full border border-brand-pink-light bg-white/95 px-6 py-3 shadow-md backdrop-blur-md">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/fulllogoela.svg"
            alt="Educational Leadership Association"
            width={180}
            height={48}
            priority
            className="hidden h-10 w-auto object-contain sm:block"
          />
          <Image
            src="/logoela.svg"
            alt="ELA"
            width={40}
            height={40}
            priority
            className="block h-9 w-auto object-contain sm:hidden"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex">
          {dict.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="whitespace-nowrap text-sm font-bold tracking-wide text-slate-800 transition-colors hover:text-brand-green"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Language switcher */}
          <button
            type="button"
            aria-label="Change language"
            onClick={toggleLang}
            className="flex items-center gap-1 rounded-full border border-brand-pink-light bg-white px-2.5 py-1 text-xs font-bold tracking-wide transition-colors"
          >
            <span
              className={currentLang === "en" ? "font-extrabold text-brand-green" : "text-slate-400 hover:text-slate-600"}
            >
              EN
            </span>
            <span className="text-brand-pink-light">|</span>
            <span
              className={currentLang === "el" ? "font-extrabold text-brand-green" : "text-slate-400 hover:text-slate-600"}
            >
              EL
            </span>
          </button>

          {/* CTA */}
          <Link
            href="#apply"
            className="hidden rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-opacity hover:opacity-90 sm:block"
          >
            {dict.cta}
          </Link>

          {/* Hamburger (mobile / tablet) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-green transition-colors hover:bg-brand-pink-light lg:hidden"
          >
            {open ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="mt-2 rounded-3xl border border-brand-pink-light bg-white/95 p-3 shadow-lg backdrop-blur-md lg:hidden">
          <ul className="flex flex-col">
            {dict.links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-full px-4 py-2.5 text-sm font-bold tracking-wide text-slate-800 transition-colors hover:bg-brand-pink-light hover:text-brand-green"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-brand-pink-light px-2 pt-3 pb-1">
            <Link
              href="#apply"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-brand-pink px-5 py-2.5 text-center text-sm font-bold tracking-wide text-white shadow-md transition-opacity hover:opacity-90"
            >
              {dict.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
