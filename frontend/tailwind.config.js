/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // "Dark white" / Soft Backgrounds - using Zinc scale for a premium, modern feel
                'brand-dark': '#f9fafb',       // Zinc 50 - Very soft off-white background
                'brand-surface': '#ffffff',    // White cards

                // Primary - Softer but professional Indigo
                'brand-primary': '#4f46e5',    // Indigo 600 - Slightly softer than 700
                'brand-primary-dark': '#4338ca', // Indigo 700 (for hover)

                // Accents - Softer variants
                'brand-accent': '#0ea5e9',     // Sky 500
                'brand-danger': '#ef4444',     // Red 500
                'brand-success': '#10b981',    // Emerald 500

                // Typography - Softer contrasts
                'brand-text-primary': '#18181b', // Zinc 900 - Soft Black
                'brand-text-secondary': '#71717a', // Zinc 500 - Soft Gray
                'brand-border': '#e4e4e7',     // Zinc 200 - Soft Border
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
