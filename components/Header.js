import Link from "next/link";

const navLinks = [
  { href: "/", label: "Beats" },
  { href: "/licensing", label: "Licensing" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  return (
    <div className="sticky top-0 z-30 border-b border-cream/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col items-start leading-none">
          <img
            src="/XM_TM5.png"
            alt="Xavier Moreno"
            className="h-14 w-auto sm:h-16"
          />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold mt-1">
            Instrumentals
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-[13px] uppercase tracking-[0.18em] text-cream/70 sm:gap-8 sm:text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

