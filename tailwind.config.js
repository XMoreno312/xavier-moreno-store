/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#141210",
        gold: "#c9a87c",
        cream: "#e8dfc8",
        muted: "#6b6258",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial"],
        display: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
