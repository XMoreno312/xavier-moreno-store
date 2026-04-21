"use client";

import { motion } from "framer-motion";

// The canonical homepage transition easing.
const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * Quiet, shared transition used between the homepage's big sections.
 * Fades + lifts + clears a soft blur as a section enters the viewport —
 * so Hero → Featured → Bio → Quiet reads as one continuous breath instead
 * of a stack of unrelated stages.
 *
 * Each inner section still owns its own in-view choreography; this wrapper
 * sits on top of that and governs the seam between them.
 */
export default function SectionReveal({
  children,
  delay = 0,
  duration = 0.8,
  className = "",
  id,
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: EASE_SILK }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
