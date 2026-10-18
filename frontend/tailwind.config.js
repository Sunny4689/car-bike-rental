/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          gold: '#d97706',
          amber: '#f59e0b',
          silver: '#e2e8f0',
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0f172a",          // Executive deep slate / charcoal
          "primary-content": "#ffffff",
          "secondary": "#d97706",        // Luxury warm amber / gold
          "secondary-content": "#ffffff",
          "accent": "#475569",           // Titanium steel
          "neutral": "#1e293b",          // Dark graphite
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",         // Pure white surfaces
          "base-200": "#f8fafc",         // Subtle light gray background
          "base-300": "#f1f5f9",         // Card borders / dividers
          "base-content": "#0f172a",     // Sharp dark text
          "info": "#0284c7",
          "success": "#16a34a",
          "warning": "#d97706",
          "error": "#dc2626",
        },
        dark: {
          "primary": "#f59e0b",          // Luxury amber / gold accent
          "primary-content": "#0f172a",
          "secondary": "#94a3b8",        // Metallic platinum
          "secondary-content": "#0f172a",
          "accent": "#64748b",           // Steel gray
          "neutral": "#1e293b",          // Surface charcoal
          "neutral-content": "#f8fafc",
          "base-100": "#0b0f19",         // Deep luxury obsidian
          "base-200": "#111827",         // Matte black container
          "base-300": "#1e293b",         // Subtle border gray
          "base-content": "#f1f5f9",     // Crisp white text
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
    darkTheme: "dark",
  },
}
