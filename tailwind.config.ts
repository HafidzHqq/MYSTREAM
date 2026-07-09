import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#f4f4f0",
          secondary: "#ffffff",
          card: "#ffffff",
          overlay: "rgba(0,0,0,0.8)",
        },
        accent: {
          purple: "#c084fc", // keep name purple for backward compat, but use bold violet
          blue: "#60a5fa",
          pink: "#ff85b3",
          yellow: "#ffdc58",
          cyan: "#22d3ee",
          green: "#86efac",
        },
        text: {
          primary: "#000000",
          secondary: "#222222",
          muted: "#555555",
        },
        border: {
          DEFAULT: "#000000",
          hover: "#000000",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #ffdc58 0%, #ff85b3 100%)",
        "gradient-hero": "linear-gradient(to top, #f4f4f0 0%, transparent 60%)",
        "gradient-card": "linear-gradient(to top, #ffffff 0%, transparent 50%)",
        "gradient-dark": "none",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
        "brutal-hover": "6px 6px 0px 0px rgba(0,0,0,1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "brutal-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
        // Keep old names mapped to brutalist shadows so we don't break everything instantly
        glow: "4px 4px 0px 0px rgba(0,0,0,1)",
        "glow-blue": "4px 4px 0px 0px rgba(0,0,0,1)",
        card: "4px 4px 0px 0px rgba(0,0,0,1)",
        "card-hover": "6px 6px 0px 0px rgba(0,0,0,1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        shimmer: "shimmer 1.5s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      borderRadius: {
        xl: "0.5rem",
        "2xl": "0.75rem",
        "3xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
