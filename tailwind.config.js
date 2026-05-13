// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B", // Deep terminal black
        surface: "#121214", // Slightly lighter for panels
        border: "#27272A",
        primary: "#10B981", // Emerald green for safe/recovered
        danger: "#EF4444", // Red for infected/danger
        susceptible: "#3B82F6", // Blue for susceptible population
        textPrimary: "#F4F4F5",
        textSecondary: "#A1A1AA",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
