/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(6 68% 86%)",
        ring: "hsl(356 88% 52%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(4 43% 13%)",
        primary: {
          DEFAULT: "hsl(356 88% 52%)",
          foreground: "hsl(0 0% 100%)"
        },
        secondary: {
          DEFAULT: "hsl(8 82% 96%)",
          foreground: "hsl(4 43% 13%)"
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)"
        },
        muted: {
          DEFAULT: "hsl(8 45% 95%)",
          foreground: "hsl(5 23% 44%)"
        },
        accent: {
          DEFAULT: "hsl(4 88% 96%)",
          foreground: "hsl(356 88% 42%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100% / 0.96)",
          foreground: "hsl(4 43% 13%)"
        }
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px"
      }
    }
  },
  plugins: []
};
