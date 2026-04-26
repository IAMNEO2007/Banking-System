import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional, Modern Color Palette - Optimized for direct use
        "primary": {
          "50": "#E8F0FA",
          "100": "#D1E1F5",
          "200": "#A3C3EB",
          "300": "#75A5E1",
          "400": "#4787D7",
          "500": "#1E69CD",
          "600": "#1E3A8A", // Primary: Navy Blue ← MAIN
          "700": "#152B66",
          "800": "#0C1D42",
          "900": "#030E20",
          "950": "#010A12",
        },
        "secondary": {
          "50": "#E0F9F7",
          "100": "#C0F3EF",
          "200": "#81E7DE",
          "300": "#42DBCE",
          "400": "#1DD4BF",
          "500": "#14B8A6",
          "600": "#0D9488", // Secondary: Teal ← MAIN
          "700": "#0A5F57",
          "800": "#042B28",
          "900": "#021513",
          "950": "#000A09",
        },
        "accent": {
          "50": "#FFFBEB",
          "100": "#FEF3C7",
          "200": "#FDE68A",
          "300": "#FCD34D",
          "400": "#FBBF24",
          "500": "#F59E0B", // Accent: Amber Gold ← MAIN
          "600": "#D97706",
          "700": "#B45309",
          "800": "#92400E",
          "900": "#78350F",
          "950": "#451A03",
        },
        "surface": {
          "50": "#F9FAFB", // Soft Gray background
          "100": "#F3F4F6",
          "200": "#E5E7EB",
          "300": "#D1D5DB",
          "400": "#9CA3AF",
          "500": "#6B7280",
          "600": "#4B5563",
          "700": "#374151",
          "800": "#1F2937",
          "900": "#111827", // Charcoal text
          "950": "#030712",
        },
        "success": {
          "50": "#F0FDF4",
          "100": "#DCFCE7",
          "200": "#BBF7D0",
          "300": "#86EFAC",
          "400": "#4ADE80",
          "500": "#22C55E",
          "600": "#16A34A",
          "700": "#15803D",
          "800": "#166534",
          "900": "#145231",
          "950": "#10B981", // Success: Emerald Green
        },
        "error": {
          "50": "#FEF2F2",
          "100": "#FEE2E2",
          "200": "#FECACA",
          "300": "#FCA5A5",
          "400": "#F87171",
          "500": "#EF4444",
          "600": "#DC2626", // Error: Crimson Red ← MAIN
          "700": "#B91C1C",
          "800": "#991B1B",
          "900": "#7F1D1D",
          "950": "#5A0A0A",
        },
        "border": "#E5E7EB", // Light Gray borders
        "background": "#F9FAFB", // Soft Gray background
        "ring": "#1E3A8A", // Navy Blue ring
        "foreground": "#111827", // Charcoal text
        "card": "#FFFFFF", // White card background
        "card-foreground": "#111827", // Charcoal card text
        "muted": "#E5E7EB", // Light Gray for muted
        "muted-foreground": "#6B7280", // Gray text
        "input": "#FFFFFF", // White input background
        "input-background": "#FFFFFF", // White input background
      },
      fontFamily: {
        'sans': ['Inter', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config
