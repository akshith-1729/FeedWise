/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        qb: {
          bg: "#e6f8ec",
          surface: "#ffffff",
          text: "#0f172a",
          muted: "#64748b",
          line: "#e2e8f0",
          green: "#16a34a",
          greenSoft: "#dcfce7",
          darkBg: "#0b1220",
          darkSurface: "#0f172a",
          darkText: "#e5e7eb",
          darkMuted: "#94a3b8",
          darkLine: "rgba(148, 163, 184, 0.18)",
        },
      },
      boxShadow: {
        qb: "0 10px 25px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        qb: "18px",
      },
    },
  },
  plugins: [],
};

