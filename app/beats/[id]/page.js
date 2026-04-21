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
    description: `${beat.genre} production in ${beat.key}, ${beat.bpm} BPM. License MP3, WAV, or Exclusive.`,
  };
}

export default function BeatPage({ params }) {
  const beat = getBeatById(params.id);
  if (!beat) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-6 sm:px-8 sm:pb-32 sm:pt-10">
      <Link
        href="/beats"
        className="inline-flex items-center gap-3 text-[10px] text-silver transition-colors duration-500 hover:text-bone"
        style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to the Catalogue
      </Link>

      <BeatDetailClient beat={beat} tiers={LICENSE_TIERS} />
    </div>
  );
}
