/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Deep slate/charcoal
                foreground: "#f8fafc",
                primary: {
                    DEFAULT: "#8b5cf6", // Violet-500
                    foreground: "#ffffff",
                    soft: "#a78bfa", // Violet-400
                    dark: "#7c3aed", // Violet-600
                },
                lavender: {
                    50: "#f5f3ff",
                    100: "#ede9fe",
                    200: "#ddd6fe",
                    300: "#c4b5fd", // Main Lavender
                    400: "#a78bfa",
                    500: "#8b5cf6",
                    600: "#7c3aed",
                    700: "#6d28d9",
                    800: "#5b21b6",
                    900: "#4c1d95",
                },
                safety: {
                    safe: "#34d399", // Emerald-400
                    moderate: "#fbbf24", // Amber-400
                    risky: "#f87171", // Red-400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
