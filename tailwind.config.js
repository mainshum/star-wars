/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tile-root": "#1B1C1D",
        sabre: "#5a5c5d",
      },
      fontFamily: "monospace",
    },
  },
  plugins: [],
};
