/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f3528",
        sand: "#ecf5f1",
        brass: "#1e7a5b",
        slate: "#2f5e50",
        mist: "#d7e7e1",
        accent: "#2a8f6c",
        "accent-soft": "#e1f0ea"
      },
      boxShadow: {
        luxe: "0 14px 35px rgba(15, 53, 40, 0.14)"
      }
    }
  },
  plugins: []
};
