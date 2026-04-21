"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "./Logo";

const navLinks = [
  { href: "/beats", label: "Beats" },
  { href: "/licensing", label: "Licensing" },
  { href: "mailto:bishopxavier20@gmail.com", label: "Contact" },
];

// Fixed pixel threshold for the fade-in on /beats. Roughly ~40–50vh on a
// typical device — short enough to feel responsive, long enough that the
// masthead is the uncontested first impression.
const FADE_START = 120;
const FADE_END = 440;

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const isBeatsIndex = pathname === "/beats";

  const opacity = useTransform(
    scrollY,
    [FADE_START, FADE_END],
    isBeatsIndex ? [0, 1] : [1, 1]
  );
  const bgAlpha = useTransform(
    scrollY,
    [FADE_START, FADE_END],
    isBeatsIndex ? [0, 0.85] : [0.85, 0.85]
  );
  const borderAlpha = useTransform(
    scrollY,
    [FADE_START, FADE_END],
    isBeatsIndex ? [0, 0.1] : [0.1, 0.1]
  );
  const bg = useTransform(bgAlpha, (a) => `rgba(11, 11, 11, ${a})`);
  const borderColor = useTransform(
    borderAlpha,
    (a) => `rgba(239, 233, 221, ${a})`
  );

  // The hero on `/` owns the whole viewport — no chrome.
  if (pathname === "/") return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-30 backdrop-blur"
      style={{
        opacity,
        backgroundColor: bg,
        borderBottom: "1px solid",
        borderColor,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="group flex items-center leading-none">
          <Logo className="h-10 w-auto sm:h-12" />
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
    </motion.div>
  );
}
