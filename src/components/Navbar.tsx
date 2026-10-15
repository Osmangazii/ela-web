"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, type Lang } from "./language-context";

interface Dictionary {
  links: { label: string; href: string }[];
  cta: string;
  ctaHref: string;
}

const DICTIONARY: Record<Lang, Dictionary> = {
  en: {
    links: [
      { label: "Purpose", href: "/#purpose" },
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Membership", href: "/membership" },
      { label: "Events", href: "/events" },
      { label: "Erasmus+", href: "/erasmus" },
      { label: "Announcements", href: "/announcements" },
    ],
    cta: "Join Us",
    ctaHref: "/membership",
  },
  el: {
    links: [
      { label: "Σκοπός", href: "/#purpose" },
      { label: "Ποιοι Είμαστε", href: "/who-we-are" },
      { label: "Μελοσύνη", href: "/membership" },
      { label: "Εκδηλώσεις", href: "/events" },
      { label: "Erasmus+", href: "/erasmus" },
      { label: "Ανακοινώσεις", href: "/announcements" },
    ],
    cta: "Εγγραφή",
    ctaHref: "/membership",
  },
};

export default function Navbar() {
  const { lang: currentLang, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const dict = DICTIONARY[currentLang];

  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto w-[94%] max-w-6xl">
      <div className="flex h-16 items-center justify-between gap-4 rounded-full border border-brand-dark/10 bg-white/95 px-6 py-3 shadow-md backdrop-blur-md">
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
        <ul className="hidden items-center gap-5 lg:flex">
          {dict.links.map((link, index) => {
            const active = isActive(link.href);
            // Alternate the underline accent per tab: pink, yellow, pink, ...
            const underlineColor = index % 2 === 0 ? "border-brand-pink" : "border-brand-yellow";
            const hoverUnderline = index % 2 === 0 ? "hover:border-brand-pink" : "hover:border-brand-yellow";
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`whitespace-nowrap border-b-2 pb-0.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                    active
                      ? `${underlineColor} text-brand-dark`
                      : `border-transparent text-slate-800 ${hoverUnderline} hover:text-brand-dark`
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Language switcher */}
          <button
            type="button"
            aria-label="Change language"
            onClick={toggleLang}
            className="flex items-center gap-1 rounded-full border border-brand-dark/10 bg-white px-2.5 py-1 text-xs font-bold tracking-wide transition-colors"
          >
            <span
              className={currentLang === "en" ? "font-extrabold text-brand-dark" : "text-slate-400 hover:text-slate-600"}
            >
              EN
            </span>
            <span className="text-brand-dark/20">|</span>
            <span
              className={currentLang === "el" ? "font-extrabold text-brand-dark" : "text-slate-400 hover:text-slate-600"}
            >
              EL
            </span>
          </button>

          {/* CTA */}
          <Link
            href={dict.ctaHref}
            className="hidden rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold tracking-wide text-white shadow-md transition-colors hover:bg-brand-pink-dark sm:block"
          >
            {dict.cta}
          </Link>

          {/* Hamburger (mobile / tablet) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-dark transition-colors hover:bg-brand-dark/5 lg:hidden"
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
        <div className="mt-2 rounded-3xl border border-brand-dark/10 bg-white/95 p-3 shadow-lg backdrop-blur-md lg:hidden">
          <ul className="flex flex-col">
            {dict.links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors ${
                      active
                        ? "bg-brand-yellow text-brand-dark"
                        : "text-slate-800 hover:bg-brand-dark/5 hover:text-brand-dark"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 border-t border-brand-dark/10 px-2 pt-3 pb-1">
            <Link
              href={dict.ctaHref}
              onClick={() => setOpen(false)}
              className="block rounded-full bg-brand-pink px-5 py-2 text-center text-sm font-semibold tracking-wide text-white shadow-md transition-colors hover:bg-brand-pink-dark"
            >
              {dict.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
