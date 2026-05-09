"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Canonical easing used throughout the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

const VIEWPORT = { once: true, margin: "-20% 0px" };

/**
 * Subtle email capture band. Reads as an editorial moment, not a growth
 * widget: small italic eyebrow, muted silver subtitle, then a native email
 * field and minimal-bone-bordered submit. Submissions POST to /api/subscribe,
 * which forwards to the Tally form (oblLvx) and falls through to logging /
 * Resend if Tally rejects the request.
 *
 * Replaces the previous Tally iframe embed because the embedded form
 * rendered placeholder/label text in low-contrast gray that was unreadable
 * against the dark stage.
 */
export default function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  const onFocus = (el) => {
    el.style.borderBottomColor = "rgba(239, 233, 221, 0.6)";
  };
  const onBlur = (el) => {
    el.style.borderBottomColor = "rgba(239, 233, 221, 0.2)";
  };

  return (
    <section
      aria-label="Join the archive"
      className="relative w-full overflow-hidden bg-stage text-bone"
      style={{ minHeight: "40vh" }}
    >
      {/* Top/bottom seam — blends into neighbouring sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Film grain — mirrors the global treatment */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />

      {/* Scoped placeholder color — same treatment as ApplicationForm. */}
      <style jsx global>{`
        .nl-input::placeholder {
          color: #a8a39a;
          opacity: 1;
        }
        .nl-input::-webkit-input-placeholder {
          color: #a8a39a;
        }
        .nl-input::-moz-placeholder {
          color: #a8a39a;
          opacity: 1;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.8, ease: EASE_SILK }}
        className="relative z-10 mx-auto flex w-full max-w-[640px] flex-col items-center justify-center px-6 py-24 text-center sm:py-32"
      >
        <p
          className="font-display italic text-bone"
          style={{
            fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.005em",
            lineHeight: 1.2,
          }}
        >
          Enter the archive.
        </p>

        <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-silver sm:text-sm">
          Get early access to new productions and unreleased work.
        </p>

        <div className="mt-10 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_SILK }}
                className="font-display italic text-bone"
                style={{
                  fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                }}
              >
                You&apos;re in.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_SILK }}
                className="mx-auto flex w-full max-w-md flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:gap-3"
              >
                <label htmlFor="nl-email" className="block flex-1 text-left">
                  <span className="sr-only">Email address</span>
                  <input
                    id="nl-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => onFocus(e.currentTarget)}
                    onBlur={(e) => onBlur(e.currentTarget)}
                    disabled={status === "submitting"}
                    className="nl-input block w-full bg-transparent border-0 border-b border-solid py-3 px-0 text-bone outline-none transition-[border-color] duration-300 ease-out disabled:opacity-60"
                    style={{
                      borderBottomColor: "rgba(239, 233, 221, 0.2)",
                      fontFamily: "inherit",
                      fontSize: "15px",
                      lineHeight: 1.5,
                    }}
                  />
                </label>

                <SubscribeButton submitting={status === "submitting"} />
              </motion.form>
            )}
          </AnimatePresence>

          {status === "error" && (
            <p
              className="mt-4 text-silver"
              style={{ fontSize: "12px", letterSpacing: "0.05em" }}
            >
              Try again.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function SubscribeButton({ submitting }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-label="Subscribe"
      className={[
        "group relative inline-flex items-center justify-center",
        "px-5 py-3 text-bone",
        "transition-all duration-[700ms] ease-out",
        "disabled:cursor-default",
      ].join(" ")}
      style={{
        border: "1px solid rgba(239, 233, 221, 0.3)",
        backgroundColor: "rgba(239, 233, 221, 0.04)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontSize: "12px",
        fontWeight: 300,
        opacity: submitting ? 0.6 : 1,
        boxShadow: "0 0 0 rgba(239,233,221,0)",
        minWidth: "56px",
      }}
      onMouseEnter={(e) => {
        if (submitting) return;
        e.currentTarget.style.borderColor = "rgba(239, 233, 221, 0.6)";
        e.currentTarget.style.backgroundColor = "rgba(239, 233, 221, 0.08)";
        e.currentTarget.style.boxShadow = "0 0 40px rgba(239,233,221,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(239, 233, 221, 0.3)";
        e.currentTarget.style.backgroundColor = "rgba(239, 233, 221, 0.04)";
        e.currentTarget.style.boxShadow = "0 0 0 rgba(239,233,221,0)";
      }}
    >
      {submitting ? "…" : "→"}
    </button>
  );
}
