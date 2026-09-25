import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        surface2: "rgb(var(--surface2-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-dim": "rgb(var(--accent-dim-rgb) / <alpha-value>)",
        urgency: "rgb(var(--urgency-rgb) / <alpha-value>)",
        "tv-text": "rgb(var(--text-rgb) / <alpha-value>)",
        "tv-muted": "rgb(var(--text-muted-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Oswald", "Impact", "'Arial Narrow'", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Space Mono'", "'Courier New'", "monospace"],
      },
      animation: {
        "price-drop": "priceDrop 0.5s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-accent": "pulseAccent 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        priceDrop: {
          "0%": { color: "rgb(var(--urgency-rgb))", transform: "scale(1.1)" },
          "100%": { color: "rgb(var(--text-rgb))", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseAccent: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
