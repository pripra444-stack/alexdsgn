/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Mobile fix: hover styles only fire on devices that actually have hover
  // (matches @media (hover: hover)). Without this, tapping a card on mobile
  // gets stuck in :hover state until the next tap elsewhere.
  future: { hoverOnlyWhenSupported: true },
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
        luna: ["LunaObscura", "Geist", "sans-serif"],
      },
      colors: {
        canvas: "#080808",
        surface: "#111111",
        "surface-2": "#181818",
        accent: "#CBFF00",
        "accent-dim": "#A8D400",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
      },
    },
  },
  plugins: [],
};
