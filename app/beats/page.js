"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import BeatsMasthead from "@/components/beats/BeatsMasthead";
import ProductionCard from "@/components/beats/ProductionCard";
import FilterChips from "@/components/beats/FilterChips";
import { beats, GENRES } from "@/config/beats";
import NewsletterBand from "@/components/newsletter/NewsletterBand";

// Same ease as the landing / masthead — a single cinematic vocabulary.
const EASE_SILK = [0.22, 0.6, 0.24, 1];

export default function BeatsPage() {
  const [activeGenre, setActiveGenre] = useState("All");

  const filteredBeats = useMemo(() => {
    if (activeGenre === "All") return beats;
    return beats.filter((b) => b.genre === activeGenre);
  }, [activeGenre]);

  // Canonical release numbers from the source order — stable across filters.
  const releaseNoFor = (id) => {
    const i = beats.findIndex((b) => b.id === id);
    return i >= 0 ? String(i + 1).padStart(3, "0") : "000";
  };

  return (
    <div className="bg-stage text-bone">
      {/* Masthead — editorial plate, bleeds into the stage below */}
      <BeatsMasthead />

      {/* Editorial separator — a deliberate breath between the title moment
          and the catalogue. Not a visible rule at the seam; the quiet IS
          the transition. A hairline mark sits low and silent. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.6, ease: EASE_SILK }}
        className="mx-auto flex max-w-6xl items-center justify-center gap-5 px-6 pt-24 sm:gap-6 sm:px-8 sm:pt-36"
      >
        <span className="h-px w-10 bg-silver/25" aria-hidden />
        <span
          className="text-[9.5px] text-silver/80"
          style={{ letterSpacing: "0.55em", textTransform: "uppercase" }}
        >
          The Archive
        </span>
        <span className="h-px w-10 bg-silver/25" aria-hidden />
      </motion.div>

      {/* Catalogue */}
      <section className="mx-auto max-w-6xl px-6 pt-16 sm:px-8 sm:pt-24">
        {/* Catalogue header — title and chips animate as one breath,
            but with a slight inner stagger so the chips feel like the
            second beat, not the first. */}
        <div className="mb-24 flex flex-col items-start gap-12 sm:mb-32 sm:flex-row sm:items-end sm:justify-between sm:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, ease: EASE_SILK }}
          >
            <p
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.52em", textTransform: "uppercase" }}
            >
              The Catalogue
            </p>
            <h2
              className="mt-5 font-display text-[1.6rem] leading-[1.1] text-bone sm:text-[2rem]"
              style={{ letterSpacing: "-0.008em" }}
            >
              Five releases, one volume.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, delay: 0.4, ease: EASE_SILK }}
          >
            <FilterChips
              genres={GENRES}
              active={activeGenre}
              onChange={setActiveGenre}
            />
          </motion.div>
        </div>

        {/* Grid — asymmetric 2-up editorial on desktop, stacked on mobile.
            Longer stagger + longer card reveal = composed, not algorithmic. */}
        {filteredBeats.length === 0 ? (
          <p
            className="py-32 text-center text-[11px] text-silver"
            style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
          >
            No releases in this genre — check back soon.
          </p>
        ) : (
          <motion.div
            key={activeGenre}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.28, delayChildren: 0.15 },
              },
            }}
            className="grid grid-cols-1 gap-x-10 gap-y-32 sm:gap-y-40 md:grid-cols-2 md:gap-x-20"
          >
            {filteredBeats.map((beat, i) => (
              <ProductionCard
                key={beat.id}
                beat={beat}
                index={i}
                releaseNo={releaseNoFor(beat.id)}
              />
            ))}
          </motion.div>
        )}

      </section>

      {/* Newsletter — quiet editorial capture below the grid */}
      <NewsletterBand />

      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        {/* Quiet closing rule */}

        <div className="mt-44 flex items-center justify-center gap-6 pb-14 sm:mt-56 sm:pb-20">
          <span className="h-px w-16 bg-silver/25" aria-hidden />
          <span
            className="text-[10px] text-silver/80"
            style={{ letterSpacing: "0.55em", textTransform: "uppercase" }}
          >
            End of Volume I
          </span>
          <span className="h-px w-16 bg-silver/25" aria-hidden />
        </div>
            </section>
    </div>
  );
}
