import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--background)",
        paper: "var(--foreground)",
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-foreground)",
        },
        secondary: "var(--secondary)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
        },
        line: "var(--border)",
        muted: "var(--muted)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        tighterx: "-0.06em",
      },
      maxWidth: {
        site: "76rem",
      },
    },
  },
  plugins: [],
};

export default config;
