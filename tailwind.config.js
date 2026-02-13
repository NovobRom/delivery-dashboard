/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    indigo: '#4f46e5',
                },
                glass: {
                    border: 'rgba(255, 255, 255, 0.5)',
                    bg: 'rgba(255, 255, 255, 0.7)',
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
