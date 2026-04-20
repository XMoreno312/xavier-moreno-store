"use client";

import { useMemo, useState } from "react";
import BeatCard from "@/components/BeatCard";
import FilterPills from "@/components/FilterPills";
import { beats, GENRES } from "@/config/beats";

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState("All");

  const filteredBeats = useMemo(() => {
    if (activeGenre === "All") return beats;
    return beats.filter((b) => b.genre === activeGenre);
  }, [activeGenre]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <section className="mb-10 sm:mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">
          Beat Store / Vol. 01
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-6xl">
          Instrumentals for <br className="hidden sm:block" />
          the romantics.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/60 sm:text-base">
          Sierreño, Indie, and R&B beats by Xavier Moreno. Preview freely —
          lease for a single release, or go exclusive and make the record yours.
        </p>
      </section>

      {/* Filters */}
      <section className="mb-6 sm:mb-8">
        <FilterPills
          genres={GENRES}
          active={activeGenre}
          onChange={setActiveGenre}
        />
      </section>

      {/* Beat list */}
      <section className="flex flex-col gap-3 sm:gap-4">
        {filteredBeats.length === 0 ? (
          <p className="py-12 text-center text-sm uppercase tracking-[0.2em] text-cream/40">
            No beats in this genre yet — check back soon.
          </p>
        ) : (
          filteredBeats.map((beat) => <BeatCard key={beat.id} beat={beat} />)
        )}
      </section>
    </div>
  );
}
