module.exports = {
  mode: "jit",
  purge: ["./components/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        foreground: "var(--mi-foreground)",
        background: "var(--mi-background)",
        secondary: "var(--mi-secondary)",
        accent: "var(--mi-accent)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
