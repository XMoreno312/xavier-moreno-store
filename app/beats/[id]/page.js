import Link from "next/link";
import { notFound } from "next/navigation";
import { beats, getBeatById, LICENSE_TIERS } from "@/config/beats";
import BeatDetailClient from "./BeatDetailClient";

// Pre-render every beat page at build time
export function generateStaticParams() {
  return beats.map((b) => ({ id: b.id }));
}

export function generateMetadata({ params }) {
  const beat = getBeatById(params.id);
  if (!beat) return { title: "Beat not found — Xavier Moreno" };
  return {
    title: `${beat.title} — Xavier Moreno`,
    description: `${beat.genre} beat in ${beat.key}, ${beat.bpm} BPM. Lease or go exclusive.`,
  };
}

export default function BeatPage({ params }) {
  const beat = getBeatById(params.id);
  if (!beat) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/60 transition-colors hover:text-gold"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to beats
      </Link>

      <BeatDetailClient beat={beat} tiers={LICENSE_TIERS} />
    </div>
  );
}
