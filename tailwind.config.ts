import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card, var(--background)))",
          foreground: "hsl(var(--card-foreground, var(--foreground)))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, var(--background)))",
          foreground: "hsl(var(--popover-foreground, var(--foreground)))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Life path colors
        path: {
          north: "hsl(var(--path-north))",
          south: "hsl(var(--path-south))",
          east: "hsl(var(--path-east))",
          west: "hsl(var(--path-west))",
        },
        // Warm semantic colors
        warm: {
          50: "#FDF8F3",
          100: "#F9EFE3",
          200: "#F0DCC5",
          300: "#E4C5A0",
          400: "#D4A87A",
          500: "#C08B5C",
          600: "#A06E3F",
          700: "#7D5530",
          800: "#5C3E24",
          900: "#3D2918",
        },
        chrome: {
          bg: "hsl(var(--chrome-bg))",
          surface: "hsl(var(--chrome-surface))",
          hover: "hsl(var(--chrome-hover))",
          border: "hsl(var(--chrome-border))",
          text: "hsl(var(--chrome-text))",
          "text-muted": "hsl(var(--chrome-text-muted))",
          accent: "hsl(var(--chrome-accent))",
          "accent-hover": "hsl(var(--chrome-accent-hover))",
        },
        terracotta: {
          50: "#FBF0EC",
          100: "#F5DCD3",
          200: "#EBB8A7",
          300: "#D9876E",
          400: "#C96B4F",
          500: "#A8523A",
          600: "#8B3F2B",
          700: "#6E3222",
          800: "#52251A",
          900: "#381911",
        },
        chart: {
          "1": "hsl(var(--chart-1, 24 60% 40%))",
          "2": "hsl(var(--chart-2, 210 65% 45%))",
          "3": "hsl(var(--chart-3, 45 75% 50%))",
          "4": "hsl(var(--chart-4, 160 40% 38%))",
          "5": "hsl(var(--chart-5, 0 60% 48%))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, var(--background)))",
          foreground: "hsl(var(--sidebar-foreground, var(--foreground)))",
          primary: "hsl(var(--sidebar-primary, var(--primary)))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground, var(--primary-foreground)))",
          accent: "hsl(var(--sidebar-accent, var(--accent)))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground, var(--accent-foreground)))",
          border: "hsl(var(--sidebar-border, var(--border)))",
          ring: "hsl(var(--sidebar-ring, var(--ring)))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
        "zoom-in": "zoom-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
