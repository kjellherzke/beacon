/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e6edf3",
        secondary: "#848d97",
        bg: "#010409",
        base: "#0d1117",
        border: "#30363d",
      },
    },
  },
  plugins: [],
};
