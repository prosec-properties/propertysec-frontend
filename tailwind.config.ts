import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        offWhite: "#F6F6F6",
        grey2: "#D3D3D3",
        grey3: "#D3D3D3",
        grey4: "#B5B5B5",
        grey5: "#9D9C9C",
        grey6: "#909090",
        grey8: "#2B2B2B",
        grey9: "#1A1A1A",
        grey10: "#0C0C0C",
        grey11: "#0C0C0C",
        grey100: "#E9E9E9",
        grey600: "#6B6B6B",
        greyBody: "#464646",
        greyBodyText: "#424141",
        grey1000: "#080808",
        primary: "#0476B9",
        blue400: "#055686",
        blue200: "#CCE4F2",
        blue100: "#F4F9FC",

        success: "#30D27A",
        success200: "#10B753",
        successLight: "#E9FFF3",
        pending: "#E48F0F",
        pendingLight: "#FFF3E2",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
