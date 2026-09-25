/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172234",
        parchment: "#f6f0df",
        navy: "#1e3155",
        terracotta: "#b85f43",
        sage: "#4f8578",
        mustard: "#d19a31",
      },
    },
  },
  plugins: [],
};
