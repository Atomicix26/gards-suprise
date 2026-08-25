import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#05020A",
          900: "#0D0618",
          800: "#140817",
          700: "#1D0A20",
        },
        bloom: {
          rose: "#FF5DA2",
          magenta: "#C23BD8",
          violet: "#9D4EDD",
          pink: "#F7C6D9",
          white: "#F6F1F7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "void-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 0%, #1D0A20 0%, #140817 35%, #0D0618 65%, #05020A 100%)",
        "glow-radial":
          "radial-gradient(circle, rgba(255,93,162,0.25) 0%, rgba(157,78,221,0.12) 45%, rgba(0,0,0,0) 70%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,93,162,0.25), 0 0 80px rgba(157,78,221,0.15)",
        "glow-sm": "0 0 20px rgba(255,93,162,0.2)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-18px) translateX(6px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
