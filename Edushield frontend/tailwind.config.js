/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-maroon': '#8A0F3D',
                'deep-maroon': '#6E0830',
                'light-maroon': '#A52A5A',
                'accent-gold': '#D4AF37',
                'dark-gray': '#333333',
                'medium-gray': '#666666',
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'maroon-gradient': 'linear-gradient(135deg, #6E0830 0%, #8A0F3D 50%, #A52A5A 100%)',
            },
            boxShadow: {
                'maroon': '0 4px 15px rgba(138, 15, 61, 0.4)',
                'card': '0 4px 20px rgba(0,0,0,0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                slideIn: { '0%': { opacity: '0', transform: 'translateX(-16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
                bounceIn: { '0%': { opacity: '0', transform: 'scale(0.85)' }, '70%': { transform: 'scale(1.04)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
