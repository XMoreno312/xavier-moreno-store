/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core stage
        ink: "#141210",         // legacy warm ink (kept for backwards compat)
        stage: "#0B0B0B",       // near-black stage — carries from the landing
        // Type
        cream: "#e8dfc8",       // warm off-white (legacy)
        bone: "#EFE9DD",        // off-white for body on stage
        // Accents
        gold: "#c9a87c",        // reserved for the logo mark
        silver: "#A8A39A",      // muted silver — metadata / dividers / eyebrow
        plum: "#7A5A74",        // subtle plum accent — restraint
        // Signature accent — cinematic deep violet. Used selectively for
        // primary CTAs, active states, progress fills, focus glows, and
        // small interactive details. The site stays near-black; iris is
        // the moment of color.
        iris: "#7C5BD8",        // primary accent — deep, premium violet
        "iris-deep": "#5B3DB0", // darker iris, for hover fills + glows
        "iris-mist": "#A48FE6", // soft iris for hovers on muted text
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial"],
        display: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
