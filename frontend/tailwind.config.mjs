/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    light: "#fef3c7", // amber-100
                    dark: "#fde68a", // amber-200
                },
                secondary: {
                    light: "#ffedd5", // orange-100
                    dark: "#fed7aa", // orange-200
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
