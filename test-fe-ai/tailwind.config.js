/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: "#310078",
        second: "#2b0167",
        third: "#44029f",
        blur: "rgba(0, 0, 0, 0.42)",
      },
      height: {
        cust: "calc(100vh - 120px)",
        body: "calc(100vh - 75px)"
      },
    },
  },
  variants: {
    extend: {
      cursor: ['hover'],
    },
  },
  plugins: [],
};
