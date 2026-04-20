"use client";

import { useState } from "react";
import { beats } from "@/config/beats";

/**
 * UI-only contact form. No backend yet — on submit, we stub an alert.
 * Hook this up later to a Next.js route handler, Formspree, Resend, etc.
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to /api/contact (or Formspree / Resend / Supabase) when ready.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/5 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Thanks</p>
        <p className="mt-2 font-display text-xl text-cream">
          Message received — I&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-cream/10 bg-ink/40 p-6 sm:p-8"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-gold">
        Get in touch
      </p>
      <h3 className="mt-2 font-display text-2xl text-cream">
        Licensing, exclusives, custom work
      </h3>
      <p className="mt-2 text-sm text-cream/60">
        Send a message and I&apos;ll respond personally within a couple of days.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="cf-name">
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputStyles}
          />
        </Field>

        <Field label="Email" htmlFor="cf-email">
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputStyles}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Beat Title" htmlFor="cf-beat">
          <select
            id="cf-beat"
            name="beat"
            defaultValue=""
            className={`${inputStyles} appearance-none pr-10`}
          >
            <option value="" disabled>
              Select a beat…
            </option>
            {beats.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
            <option value="other">Other / general inquiry</option>
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="cf-message">
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            required
            placeholder="Tell me about the project, release timeline, and which license tier you're interested in."
            className={`${inputStyles} resize-y`}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-md bg-gold px-4 py-3 text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-cream sm:w-auto sm:px-8"
      >
        Send message
      </button>
    </form>
  );
}

const inputStyles = [
  "block w-full rounded-md border border-cream/15 bg-ink/60 px-3.5 py-2.5",
  "text-sm text-cream placeholder:text-cream/30",
  "transition-colors focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40",
].join(" ");

function Field({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-cream/60">
        {label}
      </span>
      {children}
    </label>
  );
}
