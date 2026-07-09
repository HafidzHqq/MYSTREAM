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
          primary: "#0B132B",
          secondary: "#111C3A",
          card: "rgba(17, 28, 58, 0.7)",
          overlay: "rgba(11,19,43,0.8)",
        },
        accent: {
          purple: "#8b5cf6",
          blue: "#00E5FF", // Electric Cyan
          pink: "#ec4899",
          yellow: "#eab308",
          cyan: "#00E5FF", // Electric Cyan
          green: "#10b981",
        },
        text: {
          primary: "#f9fafb",
          secondary: "#d1d5db",
          muted: "#6C7A89", // Steel Gray
        },
        border: {
          DEFAULT: "rgba(108,122,137,0.2)",
          hover: "rgba(0,229,255,0.3)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0B132B 0%, #00E5FF 100%)",
        "gradient-hero": "linear-gradient(to top, #0B132B 0%, transparent 80%)",
        "gradient-card": "linear-gradient(to top, rgba(11,19,43,0.9) 0%, transparent 60%)",
        "gradient-dark": "radial-gradient(circle at top right, rgba(0,229,255,0.15), transparent 40%)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        brutal: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "brutal-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "brutal-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "brutal-lg": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(139,92,246,0.3)",
        "glow-blue": "0 0 20px rgba(59,130,246,0.3)",
        card: "0 4px 6px -1px rgba(0,0,0,0.2)",
        "card-hover": "0 10px 15px -3px rgba(0,0,0,0.3)",
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
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
