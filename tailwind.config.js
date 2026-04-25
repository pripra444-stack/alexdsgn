/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: {
          950: "#0B0B0C",
          900: "#111113",
          800: "#17181B",
          700: "#1F2023",
          600: "#26272B",
          500: "#2E3033",
          400: "#444444",
        },
        accent: {
          DEFAULT: "#D97757",
          400: "#E08A6F",
          500: "#D97757",
          600: "#C26444",
          700: "#A75338",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
