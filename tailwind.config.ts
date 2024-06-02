import type { Config } from "tailwindcss";

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
        slate: "#303030",
        background: "#111111",
        visualGraphs: {
          generation0: "#f9f871",
          generation1: "#ffc75f",
          generation2: "#ff9671",
          generation3: "#ff6f91",
          generation4: "#d65db1",
          generation5: "#845ec2",
        },
      },
    },
  },
} satisfies Config;
