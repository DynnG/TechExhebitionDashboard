import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5EEDB",
        "sea-salt": "#F9F7F7",
        "dark-serpent": "#133020",
        castleton: "#046241",
        saffron: "#FFB347",
        "earth-yellow": "#FFC370",

        // Fit Scores (Fix1.md Spec)
        "fit-5": "#FFB347",
        "fit-4": "#FFC370",
        "fit-3": "#046241",

        // Priority Levels
        "priority-high": "#C17110",
        "priority-medium": "#FFB347",
        "priority-low": "#9CAFA4",

        // Business Line Accent Colors
        "bl-ai-data": "#046241",
        "bl-aigc": "#133020",
        "bl-scanning": "#C17110",
        "bl-autonomous": "#034E34",
        "bl-aeo": "#E89131",
        "bl-edge": "#417256",

        // Standard UI mappings
        border: "#D8D2C8",
        input: "#D8D2C8",
        ring: "#046241",
        background: "#F5EEDB",
        foreground: "#133020",
        primary: {
          DEFAULT: "#FFB347",
          foreground: "#133020",
          hover: "#FFC370",
        },
        secondary: {
          DEFAULT: "#133020",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#B91C1C",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F9F7F7",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#FFB347",
          foreground: "#133020",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "system-ui", "sans-serif"],
        alimama: ["Alimama ShuHeiTi", "Microsoft YaHei", "sans-serif"],
        yahei: ["Microsoft YaHei", "PingFang SC", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
