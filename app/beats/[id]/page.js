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

  // Canonical catalog number, from the source order
  const i = beats.findIndex((b) => b.id === beat.id);
  const releaseNo = i >= 0 ? String(i + 1).padStart(3, "0") : "000";

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 pt-10 sm:px-8 sm:pb-40 sm:pt-16">
      <Link
        href="/beats"
        className="group inline-flex items-center gap-4 text-[10px] text-silver transition-colors duration-[700ms] hover:text-bone"
        style={{
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)",
        }}
      >
        <span
          aria-hidden
          className="inline-block h-px w-6 bg-silver/40 transition-all duration-[700ms] group-hover:w-8 group-hover:bg-bone/60"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 0.6, 0.24, 1)" }}
        />
        Back to the Archive
      </Link>

      <BeatDetailClient beat={beat} tiers={LICENSE_TIERS} releaseNo={releaseNo} />
    </div>
  );
}
