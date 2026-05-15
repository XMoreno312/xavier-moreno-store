"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/license-agreement", label: "License Agreement" },
  { href: "mailto:bishopxavier20@gmail.com", label: "Contact" },
];

export default function Footer() {
  const pathname = usePathname();

  // Hero on `/` owns the viewport — no footer.
  if (pathname === "/") return null;

  return (
    <footer
      id="contact"
      className="border-t border-cream/10 bg-ink/60 px-4 py-10 text-sm text-cream/60 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display tracking-[0.18em] text-cream">XAVIER MORENO</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/40">
            Productions / Licensing
          </p>
        </div>

        {/* Legal + contact nav — slim, uppercase, quietly framed. */}
        <nav
          aria-label="Legal and contact"
          className="flex flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-[0.22em] text-cream/60 sm:justify-center"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-500 hover:text-iris-mist"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs uppercase tracking-[0.2em] text-cream/50 sm:text-right">
          <p>
            Booking & exclusive inquiries:{" "}
            <a
              href="mailto:bishopxavier20@gmail.com"
              className="text-gold transition-colors hover:text-cream"
            >
              bishopxavier20@gmail.com
            </a>
          </p>
          <p className="mt-2 text-cream/30">
            © {new Date().getFullYear()} Xavier Moreno. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
