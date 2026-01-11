/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f5ff",
          100: "#e0e9ff",
          200: "#bed3ff",
          300: "#94b5ff",
          400: "#5d8aff",
          500: "#2f62f7",
          600: "#1f4cd4",
          700: "#1b40ad",
          800: "#1a388a",
          900: "#152d6c"
        }
      },
      boxShadow: {
        card: "0 10px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
