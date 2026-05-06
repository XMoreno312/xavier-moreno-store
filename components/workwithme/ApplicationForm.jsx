"use client";

import { useEffect } from "react";

/**
 * ApplicationForm — thin wrapper around the Tally embed for the
 * "Work With Me" application (form id: b5NQ46).
 *
 * We keep the surrounding container styling (max-width, centered,
 * generous vertical breathing room) so the embed slots neatly into
 * the existing page rhythm. Tally renders its own labels, validation,
 * submit button, and thank-you state inside the iframe — all of the
 * native React form state has been removed in favour of the embed.
 *
 * Tally's widgets/embed.js handles dynamic height via postMessage,
 * so the iframe collapses/grows to fit its actual content. We load
 * the script lazily on the client; loading it more than once on the
 * page is a no-op (Tally guards internally).
 */

const TALLY_SRC =
  "https://tally.so/embed/b5NQ46?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

export default function ApplicationForm() {
  useEffect(() => {
    // Tally's embed script — adds postMessage-based auto-resize for
    // any iframe with a data-tally-src attribute on the page.
    const SRC = "https://tally.so/widgets/embed.js";
    const existing = document.querySelector(`script[src="${SRC}"]`);
    if (existing) {
      // Script already present — re-run loadEmbeds in case it ran
      // before our iframe mounted.
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
      }
      return;
    }
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => {
      if (typeof window.Tally !== "undefined") {
        window.Tally.loadEmbeds();
      }
    };
    document.body.appendChild(s);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[640px] px-6 sm:px-0">
      <iframe
        data-tally-src={TALLY_SRC}
        loading="lazy"
        title="Work With Me application"
        className="block w-full min-h-[700px]"
        style={{ border: 0, width: "100%" }}
      />
    </div>
  );
}
