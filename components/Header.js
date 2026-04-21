"use client";

import Link from "next/link";
import Logo from "./Logo";

// Persistent nav. Sits above every route — visible at page load, reads
// over the dark hero via a tiny backdrop blur + semi-transparent fill.
// Left holds the lockup (crown + wordmark). Right holds the two primary
// destinations: the catalogue and a direct line to Xavier.
const navLinks = [
  { href: "/beats", label: "Productions" },
  { href: "mailto:bishopxavier20@gmail.com", label: "Contact" },
];

export default function Header() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-30 backdrop-blur"
      style={{
        backgroundColor: "rgba(11, 11, 11, 0.55)",
        borderBottom: "1px solid rgba(239, 233, 221, 0.08)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="group flex items-center leading-none">
          <Logo className="h-10 w-auto sm:h-12" blendOnBg />
        </Link>

        <nav
          className="flex items-center gap-6 text-[10px] text-bone/70 sm:gap-10"
          style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-500 hover:text-bone"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
