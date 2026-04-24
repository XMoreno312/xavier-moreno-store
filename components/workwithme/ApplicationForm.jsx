// TODO: wire to Tally embed when form ID is available
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Shared cinematic ease + button timing used across the site.
const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * Native application form — deliberately not a third-party embed. Styled to
 * match the site's cinematic language: minimal 1px bottom-border inputs,
 * transparent backgrounds, generous vertical rhythm, a single bone-on-dark
 * submit that echoes the hero's "License a Production" treatment.
 *
 * Feels like a letter, not an application. On submit we swap the form for
 * a quiet italic serif thank-you; this is placeholder behaviour until the
 * Tally embed (or equivalent) is available.
 */
export default function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No network call yet — placeholder. See top-of-file TODO.
    setSubmitted(true);
  };

  return (
    <div className="relative mx-auto w-full max-w-[540px] px-6 sm:px-0">
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.p
            key="thanks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_SILK }}
            className="font-display italic text-bone"
            style={{
              fontSize: "clamp(1.35rem, 2.1vw, 1.9rem)",
              fontWeight: 400,
              lineHeight: 1.35,
              letterSpacing: "-0.005em",
              textAlign: "center",
              textShadow: "0 2px 24px rgba(0,0,0,0.65)",
            }}
          >
            Thank you. I&apos;ll be in touch with artists I connect with.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_SILK }}
            className="flex flex-col gap-8"
            noValidate={false}
          >
            <Field label="Name" htmlFor="wm-name">
              <input
                id="wm-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className={inputStyles}
              />
            </Field>

            <Field label="Email" htmlFor="wm-email">
              <input
                id="wm-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputStyles}
              />
            </Field>

            <Field label="Artist Name" htmlFor="wm-artist">
              <input
                id="wm-artist"
                name="artistName"
                type="text"
                required
                placeholder="How you're known"
                className={inputStyles}
              />
            </Field>

            <Field label="Demo Links" htmlFor="wm-demos">
              <textarea
                id="wm-demos"
                name="demoLinks"
                required
                rows={3}
                placeholder="2–3 links, one per line"
                className={`${textareaStyles} resize-none`}
              />
            </Field>

            <Field
              label="Social Media"
              htmlFor="wm-socials"
              optional
            >
              <textarea
                id="wm-socials"
                name="socialLinks"
                rows={2}
                placeholder="Instagram, TikTok, etc."
                className={`${textareaStyles} resize-none`}
              />
            </Field>

            <Field
              label="What are you trying to create?"
              htmlFor="wm-intent"
            >
              <textarea
                id="wm-intent"
                name="intent"
                required
                rows={4}
                placeholder="The record, the feeling, the world you're reaching for."
                className={`${textareaStyles} resize-none`}
              />
            </Field>

            <div className="mt-4 flex justify-center">
              <SubmitButton />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Bits ---------- */

const inputStyles = [
  "block w-full border-0 border-b border-bone/20 bg-transparent",
  "px-0 py-2.5 text-[15px] text-bone placeholder:text-silver/70",
  "transition-colors duration-500 ease-out",
  "focus:border-bone/60 focus:outline-none focus:ring-0",
  "appearance-none rounded-none",
].join(" ");

const textareaStyles = [
  "block w-full border-0 border-b border-bone/20 bg-transparent",
  "px-0 py-2.5 text-[15px] leading-relaxed text-bone placeholder:text-silver/70",
  "transition-colors duration-500 ease-out",
  "focus:border-bone/60 focus:outline-none focus:ring-0",
  "appearance-none rounded-none",
].join(" ");

function Field({ label, htmlFor, optional = false, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span
        className="mb-3 flex items-baseline gap-3 text-[10px] text-bone/70"
        style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}
      >
        <span>{label}</span>
        {optional ? (
          <span
            className="text-silver/60"
            style={{ letterSpacing: "0.3em" }}
          >
            — optional
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

/**
 * Submit — mirrors the hero's "License a Production" button (HeroCTA.jsx):
 * bone-on-dark, hairline border, letter-spaced uppercase label, soft warm
 * glow on hover. Kept as its own subcomponent so the hover glow behavior
 * stays self-contained.
 */
function SubmitButton() {
  return (
    <button
      type="submit"
      aria-label="Submit application"
      className={[
        "group relative inline-flex items-center justify-center",
        "px-7 py-3 text-[10.5px] text-bone/90 sm:text-[11px]",
        "border border-bone/20 bg-transparent",
        "transition-all duration-[700ms] ease-out",
        "hover:text-bone hover:border-bone/45",
      ].join(" ")}
      style={{
        letterSpacing: "0.38em",
        textTransform: "uppercase",
        fontWeight: 300,
        boxShadow: "0 0 0 rgba(239,233,221,0)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 28px rgba(239,233,221,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 rgba(239,233,221,0)";
      }}
    >
      Submit Application
    </button>
  );
}
