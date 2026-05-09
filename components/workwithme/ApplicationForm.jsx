"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Canonical site easing — same curve used across hero and section reveals.
const EASE_SILK = [0.22, 1, 0.36, 1];

/**
 * ApplicationForm — native React form for the "Work With Me" application.
 *
 * Replaces the previous Tally iframe embed because Tally's free-tier theme
 * customizer doesn't expose placeholder/label text colors, which rendered
 * unreadably against this site's dark stage. We now render the fields here
 * with the site's bone-on-stage palette, and POST submissions to
 * /api/work-with-me — the route attempts to forward to Tally and falls
 * through to logging + (optional) Resend if Tally rejects the request.
 *
 * States:
 *   idle       → form visible
 *   submitting → button label "Sending…", inputs/button disabled
 *   success    → form is replaced with an italic serif thank-you line
 *   error      → small silver hint sits below the button; form stays
 */

const FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "artistName",
    label: "Artist Name",
    type: "text",
    required: true,
  },
  {
    name: "demoLinks",
    label: "Demo Links",
    type: "textarea",
    required: true,
    rows: 3,
    placeholder: "2–3 links, one per line",
  },
  {
    name: "socialLinks",
    label: "Social Media Links",
    type: "textarea",
    required: false,
    rows: 2,
    placeholder: "Instagram, TikTok, etc.",
  },
  {
    name: "message",
    label: "What are you trying to create?",
    type: "textarea",
    required: true,
    rows: 4,
  },
];

const EMPTY_FORM = FIELDS.reduce((acc, f) => {
  acc[f.name] = "";
  return acc;
}, {});

// Shared input styling — transparent bg, bone bottom-border that intensifies
// on focus. py-3 px-0 makes the underline read as a writing line. The
// placeholder color uses an inline style because Tailwind doesn't have a
// stock arbitrary-color placeholder utility on every install.
const INPUT_BASE = [
  "block w-full bg-transparent py-3 px-0 text-bone",
  "border-0 border-b border-solid",
  "outline-none focus:outline-none",
  "transition-[border-color] duration-300 ease-out",
  "disabled:opacity-60",
].join(" ");

const INPUT_STYLE = {
  borderBottomColor: "rgba(239, 233, 221, 0.2)",
  // We use CSS custom property + a global rule below for placeholder color
  // via inline <style>. Inlining keeps this self-contained.
  fontFamily: "inherit",
  fontSize: "15px",
  lineHeight: 1.5,
};

export default function ApplicationForm() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const onChange = (name) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [name]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/work-with-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch (err) {
      // Keep the form visible — only show an inline error hint.
      setStatus("error");
    }
  };

  // Focus / blur handlers boost the bottom-border opacity. We attach via
  // event handlers rather than :focus utilities so we can keep the exact
  // rgba values from the spec without configuring custom Tailwind colors.
  const onFocus = (e) => {
    e.currentTarget.style.borderBottomColor = "rgba(239, 233, 221, 0.6)";
  };
  const onBlur = (e) => {
    e.currentTarget.style.borderBottomColor = "rgba(239, 233, 221, 0.2)";
  };

  return (
    <div className="relative mx-auto w-full max-w-[640px] px-6 py-8 sm:px-0 sm:py-12">
      {/* Placeholder color — scoped via a stable className so it doesn't leak. */}
      <style jsx global>{`
        .wm-application-input::placeholder {
          color: #a8a39a;
          opacity: 1;
        }
        .wm-application-input::-webkit-input-placeholder {
          color: #a8a39a;
        }
        .wm-application-input::-moz-placeholder {
          color: #a8a39a;
          opacity: 1;
        }
      `}</style>

      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.p
            key="thanks"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SILK }}
            className="font-display italic text-bone"
            style={{
              fontSize: "clamp(1.15rem, 1.9vw, 1.55rem)",
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.005em",
              textAlign: "center",
            }}
          >
            Thank you. I&apos;ll be in touch with artists I connect with.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SILK }}
            noValidate={false}
            className="flex flex-col"
            style={{ gap: "32px" }}
          >
            {FIELDS.map((f) => {
              const fieldId = `wm-${f.name}`;
              const sharedProps = {
                id: fieldId,
                name: f.name,
                value: values[f.name],
                onChange: onChange(f.name),
                onFocus,
                onBlur,
                disabled: status === "submitting",
                required: f.required,
                placeholder: f.placeholder,
                autoComplete: f.autoComplete,
                className: `${INPUT_BASE} wm-application-input`,
                style: INPUT_STYLE,
              };
              return (
                <label key={f.name} htmlFor={fieldId} className="block">
                  <span
                    className="mb-2 block text-bone opacity-60"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 400,
                    }}
                  >
                    {f.label}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea
                      {...sharedProps}
                      rows={f.rows ?? 3}
                      className={`${INPUT_BASE} wm-application-input resize-y`}
                    />
                  ) : (
                    <input type={f.type} {...sharedProps} />
                  )}
                </label>
              );
            })}

            <div className="mt-12 flex flex-col items-center">
              <SubmitButton submitting={status === "submitting"} />
              {status === "error" && (
                <p
                  className="mt-4 text-center text-silver"
                  style={{ fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  Something went wrong. Try emailing
                  {" "}
                  <span className="text-bone/80">bishopxavier20@gmail.com</span>
                  {" "}
                  directly.
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton({ submitting }) {
  // Mirrors HeroCTA's bone-on-stage minimal button: hairline border,
  // letter-spaced label, soft glow on hover. We ship hover via inline
  // handlers to keep parity with HeroCTA.jsx and to stay friendly with
  // the per-state opacity changes.
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-label="Submit application"
      className={[
        "group relative inline-flex items-center justify-center",
        "px-7 py-3 text-bone",
        "transition-all duration-[700ms] ease-out",
        "disabled:cursor-default",
      ].join(" ")}
      style={{
        border: "1px solid rgba(239, 233, 221, 0.3)",
        backgroundColor: "rgba(239, 233, 221, 0.04)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontSize: "11px",
        fontWeight: 300,
        opacity: submitting ? 0.6 : 1,
        boxShadow: "0 0 0 rgba(239,233,221,0)",
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
      {submitting ? "Sending…" : "Submit Application"}
    </button>
  );
}
