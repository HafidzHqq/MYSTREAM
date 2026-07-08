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
          primary: "#08080f",
          secondary: "#0f0f1a",
          card: "#12121e",
          overlay: "#1a1a2e",
        },
        accent: {
          purple: "#7c3aed",
          blue: "#3b82f6",
          pink: "#ec4899",
          cyan: "#06b6d4",
        },
        text: {
          primary: "#f0f0ff",
          secondary: "#9898bb",
          muted: "#5a5a7a",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.15)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)",
        "gradient-hero": "linear-gradient(to top, #08080f 0%, transparent 60%)",
        "gradient-card": "linear-gradient(to top, #0f0f1a 0%, transparent 50%)",
        "gradient-dark": "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.4)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(124, 58, 237, 0.25)",
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
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
