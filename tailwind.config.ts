import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta JoyNatura - verdes suaves, blancos, dorados/crema
                joy: {
                    green: {
                        50: "#f0faf4",
                        100: "#d9f2e3",
                        200: "#b5e5c9",
                        300: "#82d1a5",
                        400: "#4db87d",
                        500: "#2e9d61",
                        600: "#1f7f4d",
                        700: "#1a6640",
                        800: "#175234",
                        900: "#14432c",
                    },
                    cream: {
                        50: "#fefdf8",
                        100: "#fdf9ec",
                        200: "#faf0d0",
                        300: "#f5e3a8",
                        400: "#eed07a",
                        500: "#e6bb4e",
                    },
                    gold: {
                        400: "#d4a843",
                        500: "#b8922e",
                        600: "#9a7a24",
                    },
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
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
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
