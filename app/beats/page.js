"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import BeatsMasthead from "@/components/beats/BeatsMasthead";
import ProductionCard from "@/components/beats/ProductionCard";
import FilterChips from "@/components/beats/FilterChips";
import { beats, GENRES } from "@/config/beats";

const EASE_SILK = [0.22, 1, 0.36, 1];

export default function BeatsPage() {
  const [activeGenre, setActiveGenre] = useState("All");

  const filteredBeats = useMemo(() => {
    if (activeGenre === "All") return beats;
    return beats.filter((b) => b.genre === activeGenre);
  }, [activeGenre]);

  return (
    <div className="bg-stage text-bone">
      {/* Masthead — ~75vh editorial plate */}
      <BeatsMasthead />

      {/* Catalogue */}
      <section className="mx-auto max-w-6xl px-6 pt-20 sm:px-8 sm:pt-28">
        {/* Catalogue header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: EASE_SILK }}
          className="mb-16 flex flex-col items-start gap-10 sm:mb-20 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              className="text-[10px] text-silver"
              style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
            >
              The Catalogue
            </p>
            <h2
              className="mt-4 font-display text-2xl text-bone sm:text-3xl"
              style={{ letterSpacing: "-0.005em" }}
            >
              Five releases, one volume.
            </h2>
          </div>

          <FilterChips
            genres={GENRES}
            active={activeGenre}
            onChange={setActiveGenre}
          />
        </motion.div>

        {/* Grid — 2-up editorial on desktop, stacked on mobile */}
        {filteredBeats.length === 0 ? (
          <p
            className="py-24 text-center text-[11px] text-silver"
            style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
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
                transition: { staggerChildren: 0.18, delayChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 gap-x-10 gap-y-24 sm:gap-y-32 md:grid-cols-2 md:gap-x-16"
          >
            {filteredBeats.map((beat, i) => (
              <ProductionCard key={beat.id} beat={beat} index={i} />
            ))}
          </motion.div>
        )}

        {/* Quiet closing rule */}
        <div className="mt-32 flex items-center justify-center gap-6 pb-10 sm:mt-40">
          <span className="h-px w-16 bg-silver/30" aria-hidden />
          <span
            className="text-[10px] text-silver"
            style={{ letterSpacing: "0.5em", textTransform: "uppercase" }}
          >
            End of Volume I
          </span>
          <span className="h-px w-16 bg-silver/30" aria-hidden />
        </div>
      </section>
    </div>
  );
}
