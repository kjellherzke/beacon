/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Space Grotesk",
    },

    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#A8A8A8",
        background: "#111111",
      },
    },
  },
  plugins: [],
};
