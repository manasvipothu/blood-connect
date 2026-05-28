/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bloodRed: "#ff2a2a",
        darkBg: "var(--bg-color)",
        textColor: "var(--text-color)",
        textMuted: "var(--text-muted)",
        glassWhite: "var(--glass-bg)",
      },
    },
  },
  plugins: [],
}
