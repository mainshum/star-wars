/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sabre: "0px 0px 5px yellow",
      },
      colors: {
        "tile-root": "#1B1C1D",
        sabre: "#5a5c5d",
      },
      fontFamily: "monospace",
    },
  },
  plugins: [],
};
